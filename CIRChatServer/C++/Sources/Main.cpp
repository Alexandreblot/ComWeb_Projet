/*
 * \\Author: Thibault Napoléon "Imothep"
 * \\Company: ISEN Ouest
 * \\Email: thibault.napoleon@isen-ouest.yncrea.fr
 * \\Created Date: 30-Aug-2018 - 08:55:29
 * \\Last Modified: 30-Aug-2018 - 08:56:06
 */

// Include.
#include "Main.hpp"

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
//--- Entry point of the program -------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
int main(int argc, char** argv)
{
  // We check the parameters.
  if (argc != 2)
  {
    cout << "Please add the listen port to the command line." << endl;
    return EXIT_FAILURE;
  }

  // We create the Qt application.
  QCoreApplication application(argc, argv);

  // We create the web socket server.
  QThread webSocketThread;
  WebSocketServer webSocketServer("CIR-Poll chat server", atoi(argv[1]));
  webSocketServer.moveToThread(&webSocketThread);

  // We run the application.
  webSocketThread.start();
  return application.exec();
}
