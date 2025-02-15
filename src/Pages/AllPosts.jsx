import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true); // Start loading
        const fetchedPosts = await appwriteService.getAllPost([]);
        if (fetchedPosts && fetchedPosts.documents.length > 0) {
          setPosts(fetchedPosts.documents);
        } else {
          setPosts([]);
        }
      } catch (error) {
        toast.error("Error fetching posts:", error);
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className='w-full py-12 bg-black'>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='flex flex-wrap justify-center gap-6'
        >
          {/* Loading State */}
          {isLoading && (
            <div className='flex justify-center items-center h-64'>
              <div className='w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin'></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className='text-center text-red-500 text-xl p-5'>{error}</div>
          )}

          {/* No Posts Available */}
          {!isLoading && posts.length === 0 && !error && (
            <div className='text-center text-gray-500 text-2xl p-5'>
              No posts available. Be the first to create one!
            </div>
          )}

          {!isLoading &&
            posts.length > 0 &&
            posts.map((post) => (
              <motion.div
                key={post.$id}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 30px rgba(255, 223, 0, 0.3)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className='p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4'
              >
                <PostCard
                  {...post}
                  className='bg-white/10 backdrop-blur-md rounded-lg border border-white/10 hover:border-yellow-400 transition-all duration-300'
                />
              </motion.div>
            ))}
        </motion.div>
      </Container>
    </div>
  );
}

export default AllPosts;
