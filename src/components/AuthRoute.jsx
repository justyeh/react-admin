import React, { Component } from 'react';
import { Route, Redirect,withRouter } from 'react-router-dom';
import {storage} from '@/libs/utils';

import FullpageLayout from '@/layout/Fullpage';
import ManagerLayout from '@/layout/Manage';

let authWhiteList = ['/login'];

class AuthRouter extends Component {
    render() {  
        const { component: Component, ...rest } = this.props;
        const hasToeken = !!storage.get("token");
        const layout = rest.layout;

        //设置页面的title 
        document.title = rest.meta.title;

        let routeResult = hasToeken || authWhiteList.indexOf(rest.path) > -1 ? 
            <Route {...rest} exact component={Component}/> 
            :
            <Redirect to="/login" />
        
        if(layout === 'fullpage'){
            return  (
                <FullpageLayout>{routeResult}</FullpageLayout>
            )
        }else{
            return (
                <ManagerLayout>{routeResult}</ManagerLayout>
            )
        }
      }
}
export default withRouter(AuthRouter); 