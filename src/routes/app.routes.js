import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Home from '../Pages/Home';
import New from '../Pages/New';
import Profile from '../Pages/Profile';
import CustomDrawer from '../components/CustomDrawer';
import Lancamento from '../Pages/lancamento' ;
import Relatorio from '../Pages/Relatorio';
const AppDrawer = createDrawerNavigator();

function AppRoutes(){
    return(
    <AppDrawer.Navigator
    drawerContent={ (props) => <CustomDrawer {...props} /> }

    drawerStyle={{
     backgroundColor: '#171717'
    }}
    drawerContentOptions={{
        labelStyle:{
            fontWeight: 'bold'
        },
        activeTintColor: '#FFF',
        activeBackgroundColor: '#00b94a',
        inactiveBackgroundColor: '#000',
        inactiveTintColor: '#DDD',
        itemStyle: {
            marginVertical: 5,
        }
    }}
    >
        <AppDrawer.Screen name="Home" component={Home}/>
              <AppDrawer.Screen name="Relatorio" component={Relatorio} />
        <AppDrawer.Screen name="Add" component={Lancamento} />
    </AppDrawer.Navigator>
    );
}

export default AppRoutes;
