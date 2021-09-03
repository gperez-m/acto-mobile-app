import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// Custom view
import AuthLoadingScreen from './AuthLoadingScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import SignInScreen from '../screens/SignIn/SignInScreen';
import CreateAccount from '../screens/SignUp/CreateAccount';
import ForgotPassword from '../screens/ForgotPassword/ForgotPassword';
import Policies from '../screens/ListPolicies/List';
import MyPolicies from '../screens/MyPolicies/policies';
import EditProfile from '../screens/ProfileScreen/EditProfile/form';
import PolicyDetail from '../screens/PolicyDetail/detail';
import Profile from '../screens/ProfileScreen/Profile';
import Checkout from '../screens/Checkout/parent';
import OrderDetail from '../screens/ProfileScreen/OrderDetail/OrderDetailScreen';
import Tickets from '../screens/TicketScreen';
import Claim from '../screens/TicketScreen/Claim/index';
import Chat from '../screens/TicketScreen/Chat';
import UpdateMethod from '../screens/PaymentMethod/updateMethod';
import OrderDetailSubscription from '../screens/ProfileScreen/OrderDetail/OrderDetailSubsScreen';

const AppStack = createStackNavigator({
  Home: HomeScreen,
  Other: HomeScreen,
  ListPolicies: Policies,
  Detail: PolicyDetail,
  UpdateMethod,
  Profile,
  MyPolicies,
  EditProfile,
  Checkout,
  OrderDetail,
  Tickets,
  Claim,
  Chat,
  OrderDetailSubscription
});
const AuthStack = createStackNavigator({
  SignIn: SignInScreen,
  SignUp: CreateAccount,
  ForgotPassword
});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);
