var React = require('react');

var Dashboard = React.createClass({
    
    render: function(){
        return (
            <div>

                <div class="logo">Logo here</div>
                
                <div class="left-menu p-t-1">
                    <pd-list-item position="left" icon="home" url="#!">Home</pd-list-item>
                    <pd-list-item position="left" icon="account-box" url="#!/profile">Profile</pd-list-item>
                    <pd-list-item position="left" icon="view-module" url="#!/staff">Staff</pd-list-item>
                    <pd-list-item position="left" icon="exit-to-app" url="/auth/logout">Logout</pd-list-item>
                </div>


                <div class="right-menu">
                    <template>
                        <pd-list-item position="left" icon="face" > </pd-list-item>
                    </template>
                </div>


                <div id="main">
                    Main stuff here
                </div>


            </div>
        )
    }
})

module.exports = Dashboard;