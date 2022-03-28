import { readdirSync, readFileSync } from 'fs';
import matter from 'gray-matter';
import { NextPage } from 'next';

const Post: NextPage = () => {
  return <h1>hi</h1>;
};

export async function getStaticPaths() {
  const paths = readdirSync('./posts').map((file) => {
    const slug = file.substr(0, file.lastIndexOf('.')) || file;
    return {
      params: {
        slug,
      },
    };
  });

  return {
    paths: [...paths],
    fallback: false,
  };
}

export async function getStaticProps() {
  // const blogPosts = readdirSync('./posts').map((file) => {
  //   const content = readFileSync(`./posts/${file}`, 'utf-8');
  //   return matter(content).data;
  // });

  // console.log(blogPosts);

  return {
    props: {},
  };
}

export default Post;
