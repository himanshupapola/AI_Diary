/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  Platform,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import useUserInfo from '../../hooks/useUserInfo';
import {getAuth} from '@react-native-firebase/auth';
import {
  fetchPosts,
  generateUID,
  getUserProfile,
  toggleLike,
  checkIfLiked,
} from '../../utils/supabaseFunctions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {formatDistanceToNow} from 'date-fns';
import PostModal from '../../components/PostModal';
import Header from '../../components/Header';

export default function Community() {
  const {userInfo} = useUserInfo();
  const auth = getAuth();
  const userEmail = auth.currentUser?.email || userInfo?.user?.email || '';
  const uid = generateUID(userEmail);
  const count = 3;
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const {height} = useWindowDimensions();
  const getPosts = async () => {
    setRefreshing(true);
    const data = await fetchPosts();
    setPosts(data);
    setRefreshing(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleCategorySelect = category => {
    setSelectedCategory(category);
  };

  const filteredPosts = posts.filter(
    post => selectedCategory === 'All' || post.category === selectedCategory,
  );
  return (
    <>
      <SafeAreaView
        style={[
          styles.safeArea,
          {
            paddingTop:
              Platform.OS === 'android'
                ? StatusBar.currentHeight || height * 0.05
                : 0,
          },
        ]}>
        <StatusBar barStyle="dark-content" />

        {/* TOP Container */}
        <Header />

        {/* Title  */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Wellness Hub</Text>
        </View>

        {/* Tags  */}
        <View style={styles.tagsCotainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagsScrollView}>
            {[
              'All',
              'Thoughts',
              'Wellness',
              'Relationships',
              'Goals',
              'Memories',
              'Other',
            ].map(category => (
              <TouchableOpacity
                key={category}
                onPress={() => handleCategorySelect(category)}>
                <Text
                  style={[
                    styles.scrollViewChilds,
                    selectedCategory === category ? '' : styles.inactiveTag,
                  ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {isPostModalVisible && (
          <PostModal
            onClose={() => {
              setIsPostModalVisible(false);
              getPosts();
            }}
          />
        )}
        {/* Posts */}
        <FlatList
          data={filteredPosts}
          keyExtractor={item => item.id}
          renderItem={({item}) => <PostItem post={item} userId={uid} />}
          refreshing={refreshing} // Attach refreshing state
          onRefresh={getPosts} // Call getPosts on pull-to-refresh
        />

        <View>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => setIsPostModalVisible(true)}>
            <Image
              source={require('../../assets/post.png')}
              style={styles.images}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F4F2',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
  },

  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  logo: {
    height: 48,
    width: 48,
    borderWidth: 2,
    borderRadius: 24,
    borderColor: 'white',
    resizeMode: 'cover',
    outlineColor: '#f0a63e',
    outlineWidth: 3,
  },
  notifaction: {
    position: 'relative',
    padding: 10,
  },
  badge: {
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: '#FF6B00',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Urbanist-Bold',
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    color: '#171B34',
    fontFamily: 'Urbanist-Bold',
    fontSize: 26,
    marginTop: 4,
  },
  tagsCotainer: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginBottom: 6,
  },
  tagsScrollView: {
    padding: 0,
  },
  scrollViewChilds: {
    backgroundColor: '#FE8235',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    color: 'white',
    fontSize: 15,
    fontFamily: 'Urbanist-Bold',
    marginBottom: 10,
  },

  postImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  header: {
    marginBottom: 3,
  },
  posterName: {
    fontFamily: 'Urbanist-Bold',
    color: 'lightbrown',
    fontSize: 14,
  },
  postTime: {
    fontFamily: 'Urbanist-Regular',
    color: '#A9A9A9',
  },
  postContent: {
    fontFamily: 'Urbanist-Bold',
    color: '#765144',
    marginBottom: 7,
    fontSize: 14,
  },
  postCotainer: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    marginBottom: 13,
    paddingBottom: 15,
  },
  mainPost: {
    flex: 0.85,
  },
  imageContainer: {
    flex: 0.15,
  },
  inactiveTag: {
    backgroundColor: '#d8dfeb',
    color: 'grey',
    fontFamily: 'Urbanist-Bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 100,
  },
  images: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: 'orange',
  },
});

const formatPostTime = timestamp => {
  if (!timestamp) {
    return 'Unknown time';
  }

  const date = new Date(timestamp + 'Z');

  return formatDistanceToNow(date, {addSuffix: true});
};

const PostItem = ({post, userId}) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  // Check if the user already liked the post
  useEffect(() => {
    const fetchLikeStatus = async () => {
      const alreadyLiked = await checkIfLiked(post.id, userId);
      setLiked(alreadyLiked);
    };
    fetchLikeStatus();
  }, [post.id, userId]);

  const handleLike = async () => {
    if (liked) {
      return;
    }
    const success = await toggleLike(post.id, userId);
    if (success) {
      setLiked(true);
      setLikesCount(likesCount + 1);
    }
  };

  return (
    <View style={styles.postCotainer}>
      <View style={styles.imageContainer}>
        <Image
          source={
            post.users?.profile_picture
              ? {uri: post.users.profile_picture}
              : require('../../assets/logo.png')
          }
          style={styles.postImage}
        />
      </View>
      <View style={styles.mainPost}>
        <Text style={styles.header}>
          <Text style={styles.posterName}>{post.username}</Text>
          <Text style={styles.postTime}> • {formatPostTime(post.time)}</Text>
        </Text>
        <Text style={styles.postContent}>{post.content}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={handleLike} disabled={liked}>
            <Icon
              name={liked ? 'heart' : 'heart-outline'}
              size={20}
              color={liked ? 'red' : 'black'}
              style={{marginRight: 5}}
            />
          </TouchableOpacity>
          <Text style={{fontFamily: 'Urbanist-Bold'}}>{likesCount}</Text>
        </View>
      </View>
    </View>
  );
};
