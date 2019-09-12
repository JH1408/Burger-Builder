import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders';
import * as burgerBuilderActions from '../../store/actions/index';

export const BurgerBuilder = props => {
  const [purchasing, setPurchasing] = useState(false)

  useEffect(()=> {
    props.onInitIngredients();
  }, [])

  const updatePurchaseState = (ingredients) => {
    return Object.values(ingredients).some(amount => amount > 0);
  }

  const purchaseHandler = () => {
    if (props.isAuthenticated) {
      setPurchasing(true);
    } else {
      props.onSetAuthRedirectPath('/checkout');
      props.history.push('/auth');
    }
  }

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  }

  const purchaseContinueHandler = () => {
    props.onInitPurchase();
    props.history.push('/checkout');
  }

    const disabledInfo = {
      ...props.ings
    }

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    let orderSummary = null;
    let burger = props.error ? <p>Ingredients can't be loaded.</p> : <Spinner />

  if(props.ings) {
      burger = (<React.Fragment>
        <Burger ingredients={props.ings}/>
        <BuildControls
          isAuth={props.isAuthenticated}
          ingredientAdded={props.onIngredientAdded}
          ingredientRemoved={props.onIngredientRemoved}
          disabled={disabledInfo}
          purchasable={updatePurchaseState(props.ings)}
          price={props.price}
          ordered={purchaseHandler}/>
      </React.Fragment>)
      orderSummary = (<OrderSummary
        ingredients={props.ings}
        price={props.price}
        purchaseCancelled={purchaseCancelHandler}
        purchaseContinued={purchaseContinueHandler}/>);
    }

    return (
      <React.Fragment>
        <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </React.Fragment>
    )
  }


const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients()),
    onInitPurchase: () => dispatch(burgerBuilderActions.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(burgerBuilderActions.setAuthRedirectPath(path))
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (withErrorHandler(BurgerBuilder, axios));
