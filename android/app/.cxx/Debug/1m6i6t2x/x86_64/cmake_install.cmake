# Install script for directory: C:/Users/himan/Desktop/React Native/Diary/Diary/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "C:/Program Files (x86)/appmodules")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "Debug")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Install shared libraries without execute permission?
if(NOT DEFINED CMAKE_INSTALL_SO_NO_EXE)
  set(CMAKE_INSTALL_SO_NO_EXE "0")
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "TRUE")
endif()

# Set default install directory permissions.
if(NOT DEFINED CMAKE_OBJDUMP)
  set(CMAKE_OBJDUMP "C:/Users/himan/AppData/Local/Android/Sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/windows-x86_64/bin/llvm-objdump.exe")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for each subdirectory.
  include("C:/Users/himan/Desktop/React Native/Diary/Diary/android/app/.cxx/Debug/1m6i6t2x/x86_64/rnasyncstorage_autolinked_build/cmake_install.cmake")
  include("C:/Users/himan/Desktop/React Native/Diary/Diary/android/app/.cxx/Debug/1m6i6t2x/x86_64/RNDateTimePickerCGen_autolinked_build/cmake_install.cmake")
  include("C:/Users/himan/Desktop/React Native/Diary/Diary/android/app/.cxx/Debug/1m6i6t2x/x86_64/RNCGeolocationSpec_autolinked_build/cmake_install.cmake")
  include("C:/Users/himan/Desktop/React Native/Diary/Diary/android/app/.cxx/Debug/1m6i6t2x/x86_64/RNGoogleSignInCGen_autolinked_build/cmake_install.cmake")
  include("C:/Users/himan/Desktop/React Native/Diary/Diary/android/app/.cxx/Debug/1m6i6t2x/x86_64/rnpicker_autolinked_build/cmake_install.cmake")
  include("C:/Users/himan/Desktop/React Native/Diary/Diary/android/app/.cxx/Debug/1m6i6t2x/x86_64/lottiereactnative_autolinked_build/cmake_install.cmake")
  include("C:/Users/himan/Desktop/React Native/Diary/Diary/android/app/.cxx/Debug/1m6i6t2x/x86_64/rngesturehandler_codegen_autolinked_build/cmake_install.cmake")
  include("C:/Users/himan/Desktop/React Native/Diary/Diary/android/app/.cxx/Debug/1m6i6t2x/x86_64/RNImagePickerSpec_autolinked_build/cmake_install.cmake")
  include("C:/Users/himan/Desktop/React Native/Diary/Diary/android/app/.cxx/Debug/1m6i6t2x/x86_64/safeareacontext_autolinked_build/cmake_install.cmake")
  include("C:/Users/himan/Desktop/React Native/Diary/Diary/android/app/.cxx/Debug/1m6i6t2x/x86_64/rnscreens_autolinked_build/cmake_install.cmake")
  include("C:/Users/himan/Desktop/React Native/Diary/Diary/android/app/.cxx/Debug/1m6i6t2x/x86_64/RNShareSpec_autolinked_build/cmake_install.cmake")
  include("C:/Users/himan/Desktop/React Native/Diary/Diary/android/app/.cxx/Debug/1m6i6t2x/x86_64/rnsvg_autolinked_build/cmake_install.cmake")
  include("C:/Users/himan/Desktop/React Native/Diary/Diary/android/app/.cxx/Debug/1m6i6t2x/x86_64/RNVectorIconsSpec_autolinked_build/cmake_install.cmake")

endif()

if(CMAKE_INSTALL_COMPONENT)
  set(CMAKE_INSTALL_MANIFEST "install_manifest_${CMAKE_INSTALL_COMPONENT}.txt")
else()
  set(CMAKE_INSTALL_MANIFEST "install_manifest.txt")
endif()

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
file(WRITE "C:/Users/himan/Desktop/React Native/Diary/Diary/android/app/.cxx/Debug/1m6i6t2x/x86_64/${CMAKE_INSTALL_MANIFEST}"
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
