import React from 'react';
import Link from 'gatsby-link';

const Categories = ({pathContext}) => {
  const {posts, catName} = pathContext;

  if (posts) {
    return (
        <div>
          <span>
            Posts abount {catName}:
          </span>
          <ul>
            {posts.map(post => {
              return (
                  <li>
                    <Link to={post.frontmatter.path}>
                      {post.frontmatter.title}
                    </Link>
                  </li>
              );
            })}
          </ul>
        </div>
    );
  }
};

export default Categories;