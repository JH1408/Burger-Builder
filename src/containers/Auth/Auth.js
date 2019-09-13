import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
import { updateObject, checkValidity } from '../../shared/utility';

const Auth = props => {
  const [authForm, setAuthForm] = useState({
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'E-Mail'
      },
      value: '',
      valueType: 'E-Mail',
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    },
    password: {
      elementType: 'input',
      elementConfig: {
        type: 'password',
        placeholder: 'Password'
      },
      value: '',
      valueType: 'Password',
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false
    },
  });

  const [isSignUp, setIsSignUp] = useState(true)

  const {buildingBurger, authRedirectPath, onSetAuthRedirectPath} = props;

  useEffect(() => {
    if(!buildingBurger && authRedirectPath !== '/') {
      onSetAuthRedirectPath();
    }
  }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath])

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(authForm, {
      [controlName]: updateObject(authForm[controlName], {
        value: event.target.value,
        valid: checkValidity(event.target.value, authForm[controlName].validation),
        touched: true
      })
    })
    setAuthForm(updatedControls);
  }

  const submitHandler = (event) => {
    event.preventDefault();
    props.onAuth(authForm.email.value, authForm.password.value, isSignUp )
  }

  const switchAuthModeHandler = () => {
    setIsSignUp(!isSignUp)
  }

    const formElementsArray = [];
    for (let key in authForm) {
      formElementsArray.push({
        id: key,
        config: authForm[key]
      })
    }

    let form = formElementsArray.map(formElement => (
      <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        valueType={formElement.config.valueType}
        invalid={!formElement.config.valid}
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touched}
        changed={(event) => inputChangedHandler (event, formElement.id)}/>
    ));

    if (props.loading) {
      form = <Spinner />
    }


    let errorMessage = null;
    if (props.error) {
      const error = (props.error.message).toLowerCase().replace(/[_-]/g, " ");
      let modifiedError = '';
      const capitalize = (error) => {
          modifiedError = error.charAt(0).toUpperCase() + error.slice(1)
      }
      capitalize(error)
      errorMessage = (
        <p>{modifiedError}</p>
      )
    }

    let authRedirect = null;
    if (props.isAuthenticated) {
      authRedirect = <Redirect to={props.authRedirectPath}/>
    }

    return (
      <div className={classes.Auth}>
        {authRedirect}
        <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
        {errorMessage}
        <form onSubmit={submitHandler}>
          {form}
          <Button btnType="Success">Submit</Button>
        </form>
          <Button
            clicked={switchAuthModeHandler}
            btnType="Danger">{isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}</Button>
      </div>
    )
  }

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
