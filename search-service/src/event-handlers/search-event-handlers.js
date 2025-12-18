import Search from "../models/Search.js";

async function handlePostCreated(event) {
  try {
    const newSearchPost = new Search({
      postId: event.postId,
      useId: event.userId,
      content: event.content,
      createdAt: event.createdAt,
    });

    await newSearchPost.save();

    logger.info(
      `Search post created: ${event.postId}, ${newSearchPost._id.toString()}`
    );
  } catch (e) {
    logger.error(e, "Error handling post creation event");
  }
}

export { handlePostCreated };
