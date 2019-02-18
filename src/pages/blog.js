import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";

const BlogPage = ({ data }) => {
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout>
      <div className="post-list">
        {posts.map(post => {
          const {
            node,
            node: { frontmatter }
          } = post;
          return (
            <div key={node.id} className="post-list__item">
              <h2>{frontmatter.title}</h2>
              <p>{frontmatter.date}</p>
              <div className="post-list__excerpt">
                <p>{node.excerpt}</p>
              </div>
              <Link to={node.fields.slug}>Read More</Link>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default BlogPage;

// Get all markdown data, in descending order by date,
// and grab the id, excerpt, slug, date, and title
export const pageQuery = graphql`
  query {
    allMarkdownRemark {
      edges {
        node {
          id
          excerpt(pruneLength: 250)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`;
