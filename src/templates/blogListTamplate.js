import React from "react";
import { graphql, Link } from "gatsby";
import Img from "gatsby-image";
import { kebabCase } from "lodash";

import Layout from "../components/layout";
import SEO from "../components/seo";

const BlogPage = ({ data }) => {
  const posts = data.allMarkdownRemark.edges;

  const { currentPage, numPages } = pageContext;
  const pathPrefix = "blog";
  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;

  const prevPage =
    currentPage - 1 === 1
      ? `${pathPrefix}/`
      : `${pathPrefix}/${(currentPage - 1).toString()}`;
  const nextPage = `${pathPrefix}/${(currentPage + 1).toString()}`;

  return (
    <Layout>
      <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />

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
                <Link className="button button-small" to={node.fields.slug}>
                  Read More
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      <div className="page-navigation">
        {!isFirst && (
          <Link to={prevPage} rel="prev">
            ← Previous Page
          </Link>
        )}

        {Array.from({ length: numPages }, (_, i) => (
          <Link
            key={`pagination-number${i + 1}`}
            to={`${pathPrefix}/${i === 0 ? "" : i + 1}`}
          >
            {i + 1}
          </Link>
        ))}

        {!isLast && (
          <Link to={nextPage} rel="next">
            Next Page →
          </Link>
        )}
      </div>
    </Layout>
  );
};

export default BlogPage;

// Get all markdown data, in descending order by date,
// and grab the id, excerpt, slug, date, and title
export const pageQuery = graphql`
  query($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
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
