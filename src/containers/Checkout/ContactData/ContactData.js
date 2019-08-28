import React, {Component} from 'react';
import axios from '../../../axios-orders.js';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner'

class ContactData extends Component {
  state = {
    name: '',
    address: {
      street: '',
      zipCode: '',
      city: ''
    },
    email: '',
    loading: false,
  }

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({loading: true});
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      customer: {
        name: 'Shaquanda',
        address: {
          street: 'Shaquandastreet 1',
          zipCode: '83739',
          City: "Shaquanda's City"
        },
        email: 'Shaquanda@example.com',
      },
      deliveryMethod: 'fastest'
    }
    axios.post('/orders.json', order)
      .then(response => {
        this.setState({loading: false});
        this.props.history.push('/');
      })
      .catch(error => {
        this.setState({loading: false});
      });
  }

  render () {
    let form = (<form>
      <input className={classes.Input} type="text" name="name" placeholder="Your Name" />
      <input className={classes.Input} type="email" name="email" placeholder="Your Mail" />
      <input className={classes.Input} type="text" name="street" placeholder="Street" />
      <input className={classes.Input} type="text" name="zipCode" placeholder="ZIP Code" />
      <input className={classes.Input} type="text" name="city" placeholder="CIty" />
      <Button btnType="Success" clicked={this.orderHandler}>ORDER NOW</Button>
    </form>);
    if (this.state.loading) {
      form = <Spinner/>
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

export default ContactData;
