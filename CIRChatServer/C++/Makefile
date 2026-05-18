# \\Author: Thibault Napoléon "Imothep"
# @Date:   13 April 2017 (10:43:23)
# \\Email:  thibault.napoleon@gmail.com
# \\Last modified by:   Imothep
# \\Last modified time: 13 April 2017 (11:39:58)

#-- Names ----------------------------------------------------------------------
NAME_EXECUTABLE=CIRChatServer
NAME_DOCUMENTATION=CIRChatServer
NAME_ARCHIVE=CIRChatServer
NAME_MAKEFILE=Makefile

#-- Modules --------------------------------------------------------------------
MODULES=WebSocketServer \
	Main

#-- Interfaces -----------------------------------------------------------------
QOBJECT=WebSocketServer

#-- Languages ------------------------------------------------------------------
LANGUAGES=

#-- Resources ------------------------------------------------------------------
RESOURCES=

#-- Lib paths ------------------------------------------------------------------
QTLIB=/home/napoleon/Libraries/Qt/Qt5.14.2/5.14.2/gcc_64/

#-- OS type --------------------------------------------------------------------
OS=$(shell $(OSTYPE) $(OPTION_OSTYPE))

#-- Software -------------------------------------------------------------------
COMPILER=g++
DEPEND=makedepend
OSTYPE=uname
MOC=moc
COMPILER_LANGUAGE=lupdate
COMPILER_LANGUAGE_OBJECT=lrelease
COMPILER_RESOURCE=rcc
COMPILER_DOCUMENTATION=doxygen
REMOVE=rm
ARCHIVE=tar

#-- Options --------------------------------------------------------------------
OPTION_CREATE_OBJECTS=-c
OPTION_FILE_OUTPUT=-o
OPTION_REMOVE=-f
OPTION_REMOVE_DIRECTORY=-drf
OPTION_LANGUAGE=-ts
OPTION_LANGUAGE_OBJECT=-qm
OPTIONS_ARCHIVE=-c -v -z -f
OPTIONS_PREFIX_DEPEND=-p Objects
OPTION_OSTYPE=-m
OPTIONS=-std=c++11 -Wall -O3 -ffast-math -Wno-non-template-friend -fPIC -m64 -I$(QTLIB)include/

#-- Extensions -----------------------------------------------------------------
EXTENSION_SOURCE=.cpp
EXTENSION_HEADER=.hpp
EXTENSION_OBJECT=.o
EXTENSION_QOBJECT=.moc.cpp
EXTENSION_LANGUAGE=.ts
EXTENSION_LANGUAGE_OBJECT=.qm
EXTENSION_RESOURCE=.qrc
EXTENSION_DOCUMENTATION=.dox
EXTENSION_ARCHIVE=.tgz
EXTENSION_BAK=.bak

#-- Libraries ------------------------------------------------------------------
LIBRARIES=-m64 -Wl,-O1 -Wl,-rpath=$(QTLIB)lib/ -L$(QTLIB)lib/ -lQt5OpenGL -lQt5Network -lQt5WebSockets -lQt5Core -lQt5Widgets -lQt5Gui

#-- Directories ----------------------------------------------------------------
DIRECTORY_SOURCES=Sources/
# It is extremly important that the end of this directory is the name of the
# source directory (due to the make depend).
DIRECTORY_OBJECTS=ObjectsSources/
DIRECTORY_EXECUTABLE=Executable/
DIRECTORY_DOCUMENTATION=Documentation/
DIRECTORY_ARCHIVE=

#-- Files ----------------------------------------------------------------------
FILES_SOURCES=$(MODULES:%=$(DIRECTORY_SOURCES)%$(EXTENSION_SOURCE))
FILES_OBJECTS=$(MODULES:%=$(DIRECTORY_OBJECTS)%$(EXTENSION_OBJECT))
FILES_QOBJECTS=$(QOBJECT:%=$(DIRECTORY_SOURCES)%$(EXTENSION_QOBJECT))
FILES_QOBJECTS_OBJECTS=$(QOBJECT:%=$(DIRECTORY_OBJECTS)%_moc$(EXTENSION_OBJECT))
FILES_LANGUAGES=$(LANGUAGES:%=$(DIRECTORY_SOURCES)%$(EXTENSION_LANGUAGE))
FILES_LANGUAGES_OBJECTS=$(LANGUAGES:%=$(DIRECTORY_SOURCES)%$(EXTENSION_LANGUAGE_OBJECT))
FILES_RESOURCES=$(RESOURCES:%=$(DIRECTORY_SOURCES)%$(EXTENSION_SOURCE))
FILES_RESOURCES_OBJECTS=$(RESOURCES:%=$(DIRECTORY_OBJECTS)%$(EXTENSION_OBJECT))
FILE_EXECUTABLE=$(DIRECTORY_EXECUTABLE)$(NAME_EXECUTABLE)
FILE_DOCUMENTATION=$(NAME_DOCUMENTATION)$(EXTENSION_DOCUMENTATION)
FILE_ARCHIVE=$(DIRECTORY_ARCHIVE)$(NAME_ARCHIVE)$(EXTENSION_ARCHIVE)

#-- Phony target ---------------------------------------------------------------
.PHONY:makeall all clean cleanressources cleanqobject cleanlangue cleancompil force archive cleanarchive depend documentation cleandocumentation

#-- Building -------------------------------------------------------------------
make:makeall cleanressources cleanqobject cleanlangue
makeall:$(FILE_EXECUTABLE)

# Creation of languages files.
$(DIRECTORY_SOURCES)%$(EXTENSION_LANGUAGE):force
	$(COMPILER_LANGUAGE) $(DIRECTORY_SOURCES) $(OPTION_LANGUAGE) $@

# Creation of languages object files.
$(DIRECTORY_SOURCES)%$(EXTENSION_LANGUAGE_OBJECT):$(DIRECTORY_SOURCES)%$(EXTENSION_LANGUAGE)
	$(COMPILER_LANGUAGE_OBJECT) $< $(OPTION_LANGUAGE_OBJECT) $@

# Creation of resources files.
$(DIRECTORY_SOURCES)%$(EXTENSION_SOURCE):$(DIRECTORY_SOURCES)%$(EXTENSION_RESOURCE) $(FILES_LANGUAGES_OBJECTS)
	$(COMPILER_RESOURCE) $(OPTION_FILE_OUTPUT) $@ $<

# Creation of QOBJECT files.
$(DIRECTORY_SOURCES)%$(EXTENSION_QOBJECT):$(DIRECTORY_SOURCES)%$(EXTENSION_HEADER)
	$(MOC) $(OPTION_FILE_OUTPUT) $@ $<

# Building of QOBJECT files.
$(DIRECTORY_OBJECTS)%_moc$(EXTENSION_OBJECT):$(DIRECTORY_SOURCES)%$(EXTENSION_QOBJECT)
	$(COMPILER) $(OPTIONS) $(LANGUAGE_OPTION) $(3D_MOUSE) $(OPTION_FILE_OUTPUT) $@ $(OPTION_CREATE_OBJECTS) $<

# Building
$(DIRECTORY_OBJECTS)%$(EXTENSION_OBJECT):$(DIRECTORY_SOURCES)%$(EXTENSION_SOURCE)
	$(COMPILER) $(OPTIONS) $(LANGUAGE_OPTION) $(3D_MOUSE) $(OPTION_FILE_OUTPUT) $@ $(OPTION_CREATE_OBJECTS) $<

# Linking and creation of the executable.
$(FILE_EXECUTABLE):$(FILES_OBJECTS) $(FILES_QOBJECTS_OBJECTS) $(FILES_RESOURCES_OBJECTS) $(FILES_LANGUAGES)
	$(COMPILER) $(OPTION_FILE_OUTPUT) $@ $(FILES_OBJECTS) $(FILES_QOBJECTS_OBJECTS) $(FILES_RESOURCES_OBJECTS) $(LIBRARIES)

compil:make

#-- Clean building -------------------------------------------------------------
clean:
	$(REMOVE) $(OPTION_REMOVE) $(FILE_EXECUTABLE) $(FILES_OBJECTS) $(FILES_QOBJECTS) $(FILES_QOBJECTS_OBJECTS)  $(FILES_LANGUAGES_OBJECTS) $(FILES_RESOURCES) $(FILES_RESOURCES_OBJECTS)

cleancompil:clean

#-- Clean resources building ---------------------------------------------------
cleanressources:
	$(REMOVE) $(OPTION_REMOVE) $(FILES_RESOURCES)

#-- Clean QOBJECT building -----------------------------------------------------
cleanqobject:
	$(REMOVE) $(OPTION_REMOVE) $(FILES_QOBJECTS)

#-- Clean languages building ---------------------------------------------------
cleanlangue:
	$(REMOVE) $(OPTION_REMOVE) $(FILES_LANGUAGES_OBJECTS)

#-- Build all ------------------------------------------------------------------
all:clean make

#-- Documentation --------------------------------------------------------------
documentation:
	$(COMPILER_DOCUMENTATION) $(FILE_DOCUMENTATION)

#-- Clean documentation --------------------------------------------------------
cleandocumentation:
	$(REMOVE) $(OPTION_REMOVE_DIRECTORY) $(DIRECTORY_DOCUMENTATION)*

#-- Archive --------------------------------------------------------------------
archive:
	$(ARCHIVE) $(OPTIONS_ARCHIVE) $(FILE_ARCHIVE) $(DIRECTORY_SOURCES) $(NAME_MAKEFILE)

#-- Clean archive --------------------------------------------------------------
cleanarchive:
	$(REMOVE) $(OPTION_REMOVE) $(FILE_ARCHIVE)

#-- Creation of dependancies ---------------------------------------------------
depend:
	$(DEPEND) $(OPTIONS_PREFIX_DEPEND) $(FILES_SOURCES)
	$(REMOVE) $(OPTION_REMOVE) $(NAME_MAKEFILE)$(EXTENSION_BAK)

#-- Dependancies (warning this part is automatically build by make depend) ------
# DO NOT DELETE

ObjectsSources/WebSocketServer.o: Sources/WebSocketServer.hpp
ObjectsSources/WebSocketServer.o: Sources/Includes.hpp
ObjectsSources/Main.o: Sources/Main.hpp Sources/WebSocketServer.hpp
ObjectsSources/Main.o: Sources/Includes.hpp
