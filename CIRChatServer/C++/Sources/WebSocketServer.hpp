/*
 * \\Author: Thibault Napoléon "Imothep"
 * \\Company: ISEN Ouest
 * \\Email: thibault.napoleon@isen-ouest.yncrea.fr
 * \\Created Date: 30-Aug-2018 - 08:55:53
 * \\Last Modified: 30-Aug-2018 - 08:56:01
 */

#ifndef WEBSOCKETSERVER_HPP
#define WEBSOCKETSERVER_HPP

// Includes.
#include "Includes.hpp"

class WebSocketServer: public QObject
{
Q_OBJECT

private:
  QWebSocketServer* server;
  QList<QWebSocket*> clients;
  QMap<QWebSocket*, qint64> timestamps;
  QMap<QWebSocket*, float> nbMessages;

public:
  // Constructor.
  WebSocketServer(QString name, int port, QObject* parent = 0);

  // Destructor.
  ~WebSocketServer();

  // Method.
  void sendMessage(QString message);

public slots:
  // Slots.
  void newConnection();
  void socketDisconnected();
  void messageReceived(QString message);

signals:
  // Signals.
  void closed ();
};

#endif
