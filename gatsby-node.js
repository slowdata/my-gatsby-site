/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const _ = require("lodash");
const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  const postTemplate = path.resolve(`src/templates/postTemplate.js`);
  const tagsTemplate = path.resolve(`src/templates/tagsTemplate.js`);

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              tags
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }
    const posts = result.data.allMarkdownRemark.edges;
    // Create blog posts
    posts.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: postTemplate,
        context: { slug: node.fields.slug } // additional data can be passed via context
      });
    });

    // create Tags pages
    // pulled directly from from https://www.gatsbyjs.org/docs/adding-tags-and-categories-to-blog-posts/#add-tags-to-your-markdown-files

    let tags = [];
    // Iterate though each post, pulling all found tags into `tags`
    _.each(posts, edge => {
      if (_.get(edge, "node.frontmatter.tags")) {
        tags = tags.concat(edge.node.frontmatter.tags);
      }
    });
    // Eliminate duplicate tags
    tags = _.uniq(tags);
    // Make Tags page
    tags.forEach(tag => {
      createPage({
        path: `/tags/${_.kebabCase(tag)}/`,
        component: tagsTemplate,
        context: {
          tag
        }
      });
    });
    // Create blog post list pages
    const postsPerPage = 2;
    const numPages = Math.ceil(posts.length / postsPerPage);

    Array.from({ lenght: numPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `blog/` : `blog/${i + 1}`,
        component: blogListTemplate,
        context: {
          limit: postsPerPage,
          skip: i * postsPerPage,
          numpages,
          currentPAge: i + 1
        }
      });
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  if (node.internal.type === "MarkdownRemark") {
    const slug = createFilePath({ node, getNode, basePath: "pages" });
    createNodeField({
      node,
      name: "slug",
      value: slug
    });
  }
};
