if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/himan/.gradle/caches/8.12/transforms/6c620899d9145a16f72e4ed8fb5b695d/transformed/hermes-android-0.78.0-debug/prefab/modules/libhermes/libs/android.x86_64/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/himan/.gradle/caches/8.12/transforms/6c620899d9145a16f72e4ed8fb5b695d/transformed/hermes-android-0.78.0-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

