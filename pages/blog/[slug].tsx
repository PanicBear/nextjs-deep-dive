import Layout from '@components/layout';
import { read, readdirSync, readFileSync } from 'fs';
import matter from 'gray-matter';
import { GetStaticProps, NextPage } from 'next';
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse/lib';
import { unified } from 'unified';

const Post: NextPage<{ post: string; data: { title: string; date: string; category: string } }> = ({ post, data }) => {
  return (
    <Layout title={data.title} seoTitle={data.title}>
      <div className="blog-post_content" dangerouslySetInnerHTML={{ __html: post }}></div>
    </Layout>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export const getStaticProps: GetStaticProps = async (ctx: any) => {
  const { content, data } = matter.read(`./posts/${ctx.params?.slug}.md`);
  const { value: post } = await unified().use(remarkParse).use(remarkHtml).process(content);

  return {
    props: {
      post,
      data,
    },
  };
};

export default Post;
