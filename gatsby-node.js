const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const createCategoryPages = (createPage, posts) => {
  const categoryPageTemplate = path.resolve(`src/templates/categories.js`);
  const allCategoriesTemplate = path.resolve(`src/templates/all-categories.js`);

  const postsByCategories = {};

  posts.forEach(({node}) => {
    if (node.frontmatter.categories) {
      node.frontmatter.categories.forEach(categories => {
        if (!postsByCategories[categories]) {
          postsByCategories[categories] = [];
        }
        postsByCategories[categories].push(node);
      });
    }
  });

  const categories = Object.keys(postsByCategories);

  createPage({
    path: `/categories`,
    component: allCategoriesTemplate,
    context: {
      categories: categories.sort(),
    },
  });

  categories.forEach(catName => {
    const posts = postsByCategories[catName];

    createPage({
      path: `/categories/${catName}`,
      component: categoryPageTemplate,
      context: {
        posts,
        catName,
      },
    });
  });
};

const createTagPages = (createPage, posts) => {
  const tagPageTemplate = path.resolve(`src/templates/tags.js`);
  const allTagsTemplate = path.resolve(`src/templates/all-tags.js`);

  const postsByTags = {};

  posts.forEach(({node}) => {
    if (node.frontmatter.tags) {
      node.frontmatter.tags.forEach(tag => {
        if (!postsByTags[tag]) {
          postsByTags[tag] = [];
        }
        postsByTags[tag].push(node);
      });
    }
  });

  const tags = Object.keys(postsByTags);

  createPage({
    path: `/tags`,
    component: allTagsTemplate,
    context: {
      tags: tags.sort(),
    },
  });

  tags.forEach(tagName => {
    const posts = postsByTags[tagName];

    createPage({
      path: `/tags/${tagName}`,
      component: tagPageTemplate,
      context: {
        posts,
        tagName,
      },
    });
  });
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  const blogPost = path.resolve(`./src/templates/blog-post.js`)

  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                categories
                tags
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const posts = result.data.allMarkdownRemark.edges

    createTagPages(createPage, posts);
    createCategoryPages(createPage, posts);

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: `/entry${post.node.fields.slug}`,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })
    return null
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
