import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'

const burger = (props) => {
  // const transformedIngredients = Object.keys(props.ingredients).map(igKey => {
  //   return [...Array(props.ingredients[igKey])].map((_, i) => {
  //     return <BurgerIngredient key={igKey + i} type={igKey} />
  //   });
  // });
  let transformedIngredients = [];
  for (let key in props.ingredients) {
      for (let i = 0; i < props.ingredients[key]; i++) {
          transformedIngredients.push(<BurgerIngredient key={key + i} type={key} />);
      }
  }

  transformedIngredients = transformedIngredients.reduce((arr, el) => {
    return arr.concat(el)
  }, []);

  if (transformedIngredients.length === 0) {
    transformedIngredients = <p>Please start adding ingredients!</p>
  }

  return (
    <div className={classes.Burger}>
      <BurgerIngredient type ="bread-top" />
      {transformedIngredients}
      <BurgerIngredient type ="bread-bottom" />
    </div>
  );
};

export default burger;
