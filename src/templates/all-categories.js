import React from 'react';
import Link from 'gatsby-link';

const AllCategories = ({pathContext}) => {
  const {categories} = pathContext;

  if (categories) {
    return (
        <div>
          <ul>
            {categories.map(category => {
              return (
                  <li>
                    <Link to={`/categories/${category}`}>
                      {category}
                    </Link>
                  </li>
              );
            })}
          </ul>
        </div>
    );
  }
};

export default AllCategories;