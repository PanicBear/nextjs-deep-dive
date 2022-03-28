import { read, readdirSync, readFileSync } from 'fs';
import matter from 'gray-matter';
import { GetStaticProps, NextPage } from 'next';
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse/lib';
import { unified } from 'unified';

const Post: NextPage<{ post: string }> = ({ post }) => {
  return <div>{post}</div>;
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

export const getStaticProps: GetStaticProps = async (ctx: any) => {
  const { content } = matter.read(`./posts/${ctx.params?.slug}.md`);
  const { value: post } = await unified().use(remarkParse).use(remarkHtml).process(content);

  return {
    props: {
      post,
    },
  };
};

export default Post;
