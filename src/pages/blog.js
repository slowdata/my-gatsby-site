import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import Img from "gatsby-image";

import { kebabCase } from "lodash";

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
              <div className="post-list__thumbnail">
                <Link to={node.fields.slug}>
                  <Img fixed={frontmatter.thumbnail.childImageSharp.fixed} />
                </Link>
              </div>
              <div className="post-list__content">
                <h2>{frontmatter.title}</h2>
                {frontmatter.tags ? (
                  <div className="tags-container">
                    <ul className="taglist">
                      {frontmatter.tags.map(tag => (
                        <li key={tag + `tag`}>
                          <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <p>{frontmatter.date}</p>
                <div className="post-list__excerpt">
                  <p>{node.excerpt}</p>
                </div>
                <Link to={node.fields.slug}>Read More</Link>
              </div>
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
            path
            thumbnail {
              childImageSharp {
                fixed(width: 200, height: 200) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
            tags
          }
        }
      }
    }
  }
`;
