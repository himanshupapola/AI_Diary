if(NOT TARGET react-native-reanimated::reanimated)
add_library(react-native-reanimated::reanimated INTERFACE IMPORTED)
set_target_properties(react-native-reanimated::reanimated PROPERTIES
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/himan/Desktop/React Native/00-mini-project/Diary/node_modules/react-native-reanimated/android/build/prefab-headers/reanimated"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

if(NOT TARGET react-native-reanimated::worklets)
add_library(react-native-reanimated::worklets INTERFACE IMPORTED)
set_target_properties(react-native-reanimated::worklets PROPERTIES
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/himan/Desktop/React Native/00-mini-project/Diary/node_modules/react-native-reanimated/android/build/prefab-headers/worklets"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

