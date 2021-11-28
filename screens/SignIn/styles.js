import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const style = StyleSheet.create({
    keyboardContainer: {
        width: '100%',
        flex: 1,
        justifyContent: 'center'  
    },
    container: {
        marginLeft: 25,
        marginRight: 25,
        marginTop:65,
        justifyContent: 'center',
        alignItems: 'center'    },
    backgroundLogin:{
        flex: 1,
        width: null,
        height: null,
        backgroundColor: 'rgba(126, 73, 214, 0.45)'
    },
    overlay:{
        backgroundColor:'rgba(255,0,0,0.5)'
    },
    logo: {
        tintColor: "black",
        width: 200,
        height: 50,
        resizeMode: 'contain'
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "400"
    },
    mt4: {
        marginTop: 4
    },
    mt16: {
        marginTop: 16
    },
    mt32: {
        marginTop: 32
    },
    mt40: {
        marginTop: 40
    },
    fullWidth: {
        width: '90%'
    },
    formInput: {
        textAlign: 'center',
        color: '#000000'
    },
    inputLabel: {
        textAlign: 'center',
        color: Colors.inputLabelColor,
        fontStyle: 'normal',
        fontWeight: "100"
    },
    containerInput: {
        marginTop: -5,
        borderBottomColor: Colors.bottomDisableColor
    },
    containerInputFocus: {
        borderBottomColor: Colors.bottomColor
    }
})

export default style;