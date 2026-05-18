/*
 * \\Author: Thibault Napoléon "Imothep"
 * \\Company: ISEN Ouest
 * \\Email: thibault.napoleon@isen-ouest.yncrea.fr
 * \\Created Date: 30-Aug-2018 - 08:54:30
 * \\Last Modified: 30-Aug-2018 - 08:56:23
 */

// Include.
#include "WebSocketServer.hpp"

//------------------------------------------------------------------------------
//--- Constructor --------------------------------------------------------------
//------------------------------------------------------------------------------
WebSocketServer::WebSocketServer(QString name, int port, QObject* parent):
  QObject(parent),
  server(new QWebSocketServer(name, QWebSocketServer::NonSecureMode, this)),
  clients()
{
  if (this->server->listen(QHostAddress::Any, port))
  {
    cout << name.toStdString() << " listening on port " << port << endl;
    connect(this->server, &QWebSocketServer::newConnection, this,
      &WebSocketServer::newConnection);
    connect(this->server, &QWebSocketServer::closed, this,
      &WebSocketServer::closed);
  }
}

//------------------------------------------------------------------------------
//--- Destructor ---------------------------------------------------------------
//------------------------------------------------------------------------------
WebSocketServer::~WebSocketServer()
{
  this->server->close();
  qDeleteAll(this->clients.begin(), this->clients.end());
}

//------------------------------------------------------------------------------
//--- Method -------------------------------------------------------------------
//------------------------------------------------------------------------------
void WebSocketServer::sendMessage(QString message)
{
  cout << "Send message: " << message.toStdString() << endl;
  for (int i = 0; i < this->clients.size (); i++)
    this->clients[i]->sendTextMessage(message);
}

//------------------------------------------------------------------------------
//--- Slots --------------------------------------------------------------------
//------------------------------------------------------------------------------
void WebSocketServer::newConnection()
{
  QWebSocket* clientSocket;

  clientSocket = this->server->nextPendingConnection();
  cout << "Client connect: " << clientSocket->peerAddress().toString().
    toStdString() << "(" << clientSocket->peerName().toStdString() <<
    ")" << endl;
  this->clients << clientSocket;
  this->timestamps[clientSocket] = QDateTime::currentSecsSinceEpoch();
  this->nbMessages[clientSocket] = 0;
  connect(clientSocket, &QWebSocket::textMessageReceived, this,
    &WebSocketServer::messageReceived);
  connect(clientSocket, &QWebSocket::disconnected, this,
    &WebSocketServer::socketDisconnected);
}

//------------------------------------------------------------------------------
void WebSocketServer::socketDisconnected()
{
  QWebSocket* clientSocket;

  clientSocket = qobject_cast<QWebSocket*>(sender());
  cout << "Client disconnected: " << clientSocket << endl;
  if (clientSocket)
  {
    this->clients.removeAll(clientSocket);
    clientSocket->deleteLater();
  }
}

//------------------------------------------------------------------------------
void WebSocketServer::messageReceived(QString message)
{
  QWebSocket* clientSocket;

  clientSocket = qobject_cast<QWebSocket*>(sender());
  cout << "Message received: " << message.toStdString() << endl;
  this->nbMessages[clientSocket]++;
  if (this->nbMessages[clientSocket]/(QDateTime::currentSecsSinceEpoch() -
    this->timestamps[clientSocket]) > MAX_MPS)
  {
    cout << "Client banned: " << clientSocket->peerAddress().toString().
    toStdString() << "(" << clientSocket->peerName().toStdString() <<
    ")" << endl;
    clientSocket->abort();
  }
  else
    this->sendMessage(message);
}
