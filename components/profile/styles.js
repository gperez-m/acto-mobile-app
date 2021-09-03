import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        backgroundColor: '#ebebeb',
    },
    containerInformation:{
        flex: 1.5
    },
    containerHistory:{
        flex: 2
    },
    cardInformation:{
        // flex:1,
        flexDirection:'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        height: '100%'
    },
    titleText:{
        fontSize: 17,
        fontWeight: '400'
    },
    name:{
     color: Colors.primaryColor,
     fontSize: 18,
     fontWeight:'400',
    },
    email:{
        color: Colors.textGrayColor,
        fontSize:15,
    },
    password:{
        color: Colors.primaryColor,
        fontSize: 16
    },
    ml15:{
        marginLeft: 15,
    },
    ml10:{
        marginLeft: 10,
    },
    mt5:{
        marginTop: 5,
    },
    mt15:{
        marginTop: 15,
    }
})

export default style;