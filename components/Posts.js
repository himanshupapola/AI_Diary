const PostItem = ({post}) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <View style={styles.postCotainer}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.postImage}
        />
      </View>
      <View style={styles.mainPost}>
        <Text style={styles.header}>
          <Text style={styles.posterName}>{post.username}</Text>
          <Text style={styles.postTime}> • {post.time}</Text>
        </Text>
        <Text style={styles.postContent}>{post.content}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={handleLike}>
            <Icon
              name={liked ? 'heart' : 'heart-outline'}
              size={20}
              color={liked ? 'red' : 'black'}
              style={{marginRight: 5}}
            />
          </TouchableOpacity>
          <Text>{likesCount}</Text>
        </View>
      </View>
    </View>
  );
};