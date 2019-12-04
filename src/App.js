import React, { Component } from 'react';
import './App.css';
import {Tabs, Tab} from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// SuperAgentの利用宣言
import request from 'superagent';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';

class App extends Component {
    constructor(props) {
        super(props);
        this.state={
            status_tab: {
                dic0:true,
                dic1:true,
                dic2:true
            },
            sensorDatas:null,
            RollData:null,
            HeadingData:null,
            Humidity:null,
            temperature:null,
            accelerationX:null,
            accelerationY:null,
            accelerationZ:null,
            dateDATA:null,

        };
    }

    // マウントされる時
    getSensorData() {
        //JSONファイルの読み込み
        request.get('http://192.168.1.80/api/json').accept('application/json').end((err,res)=>{
            this.loadedJSON(err,res)
        })
    }

    componentDidMount(){
        //定期処理
        this.intervalId = setInterval(this.getSensorData.bind(this), 50);
    }

    // データを読み込んだ時
    loadedJSON(err,res){
        var array = [];
        if(err){
            console.log('JSON読み込みエラー');
            return
        }
        for(var i in res.body){
            array.push(res.body[i])
        }
        // 状態を更新
        let data1 = array[0]['EH'];
        let data2 = array[0]['ER'];
        let data3 = array[0]['Humidity'];
        let data4 = array[0]['temperature'];
        let data5 = array[0]['ax'];
        let data6 = array[0]['ay'];
        let data7 = array[0]['az'];
        let data8 = array[0]['datetime'];
        this.setState({
            sensorDatas:array,
            RollData: data2,
            HeadingData: data1,
            Humidity:data3,
            temperature:data4,
            accelerationX:data5,
            accelerationY:data6,
            accelerationZ:data7,
            dateDATA:data8,
        })
    }


    render(){
        const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};
        return(
        <MuiThemeProvider>
        <Tabs>
            {(() => {
                if (this.state.status_tab['dic0'])
                    return <Tab label={"グラフ"} >
                        <div className="App">
                            <h1>９軸センサー値取得</h1>
                            <div className="sensorGraph_sepalator">
                            <div className="sensorGraph">
                                <p>オイラー角グラフ</p>
                                <Euler sensordata={this.state.sensorDatas}/>
                            </div>
                            <div className="sensorGraph">
                                <p>加速度グラフ</p>
                                <Accel sensordata={this.state.sensorDatas}/>
                            </div>
                            </div>
                            <div className="sensorGraph_sepalator">
                            <div className="sensorGraph">
                                <p>地磁気グラフ</p>
                                <Linear sensordata={this.state.sensorDatas}/>
                            </div>
                            <div className="sensorGraph">
                                <p>角速度グラフ</p>
                                <Gyro sensordata={this.state.sensorDatas}/>
                            </div>
                            </div>
                            <div className="sensorGraph_sepalator">
                            <div className="sensorGraph">
                                <p>温度・湿度グラフ</p>
                                <Tmp sensordata={this.state.sensorDatas}/>
                            </div>
                            </div>

                        </div>

                    </Tab>;
            })()}

            {(() => {
                if (this.state.status_tab['dic1'])
                    return <Tab label="各種表データ" >
                        <div className="App">
                            <h1>９軸センサー値取得</h1>
                            <center>
                            <table border="1" width="400" cellSpacing="0" cellPadding="5" bordercolor="#333333">
                                <tr>
                                    <th bgcolor="#EE0000"><font color="#FFFFFF">項目</font></th>
                                    <th bgcolor="#EE0000" width="180"><font color="#FFFFFF">センサー値</font></th>
                                </tr>
                                <tr>
                                    <td bgcolor="#99CC00" align="right" nowrap>時刻</td>
                                    <td bgcolor="#FFFFFF" valign="top" width="150">{this.state.dateDATA}</td>
                                </tr>
                                <tr>
                                    <td bgcolor="#99CC00" align="right" nowrap>Heading</td>
                                    <td bgcolor="#FFFFFF" valign="top" width="150">{this.state.HeadingData}deg</td>
                                </tr>
                                <tr>
                                    <td bgcolor="#99CC00" align="right" nowrap>Roll</td>
                                    <td bgcolor="#FFFFFF" valign="top" width="150">{this.state.RollData}deg</td>
                                </tr>
                                <tr>
                                    <td bgcolor="#99CC00" align="right" nowrap>温度</td>
                                    <td bgcolor="#FFFFFF" valign="top" width="150">{this.state.temperature}℃</td>
                                </tr>
                                <tr>
                                    <td bgcolor="#99CC00" align="right" nowrap>湿度</td>
                                    <td bgcolor="#FFFFFF" valign="top" width="150">{this.state.Humidity}%</td>
                                </tr>
                                <tr>
                                    <td bgcolor="#99CC00" align="right" nowrap>
                                        acceleration(x軸)</td>
                                    <td bgcolor="#FFFFFF" valign="top" width="150">{this.state.accelerationX}</td>
                                </tr>
                                <tr>
                                    <td bgcolor="#99CC00" align="right" nowrap>
                                        acceleration(y軸)</td>
                                    <td bgcolor="#FFFFFF" valign="top" width="150">{this.state.accelerationY}</td>
                                </tr>
                                <tr>
                                    <td bgcolor="#99CC00" align="right" nowrap>
                                        acceleration(z軸)</td>
                                    <td bgcolor="#FFFFFF" valign="top" width="150">{this.state.accelerationZ}</td>
                                </tr>
                            </table>
                            </center>
                        </div>
    </Tab>;
            })()}
            {(() => {
                if (this.state.status_tab['dic1'])
                    return <Tab
      label="onActive"
      data-route="/home"

    >
      <div>
        <h2 style={styles.headline}>Tab Three</h2>
        <p>
          This is a third example tab.
        </p>
      </div>
    </Tab>;
            })()}
  </Tabs>
  </MuiThemeProvider>
        );
   }
   }

class Accel extends React.Component{
    render() {
        return (
            <LineChart
                width={500}
                height={300}
                data={this.props.sensordata}
                margin={{
                    top: 20, right: 50, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="datetime" />
                <YAxis ticks={[-1,-0.5,0,0.5,1]}/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ax" stroke="#8884d8" />
                <Line type="monotone" dataKey="ay" stroke="#82ca9d" />
                <Line type="monotone" dataKey="az" stroke="#82ca9d" />
            </LineChart>
        );
    }
};

class Linear extends React.Component{
    render() {
        return (
            <LineChart
                width={500}
                height={300}
                data={this.props.sensordata}
                margin={{
                    top: 20, right: 50, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="datetime" />
                <YAxis ticks={[-1,-0.5,0,0.5,1]}/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Lx" stroke="#8884d8" />
                <Line type="monotone" dataKey="Ly" stroke="#82ca9d" />
                <Line type="monotone" dataKey="Lz" stroke="#82ca9d" />
            </LineChart>
        );
    }
};

class Gyro extends React.Component{
    render() {
        return (
            <LineChart
                width={500}
                height={300}
                data={this.props.sensordata}
                margin={{
                    top: 20, right: 50, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="datetime" angle={90} height={90}/>
                <YAxis ticks={[-2,0,2,4,10]}/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="gx" stroke="#8884d8" />
                <Line type="monotone" dataKey="gy" stroke="#82ca9d" />
                <Line type="monotone" dataKey="gz" stroke="#82ca9d" />
            </LineChart>
        );
    }
};

class Tmp extends React.Component{
    render() {
        return (
            <LineChart
                width={500}
                height={300}
                data={this.props.sensordata}
                margin={{
                    top: 20, right: 50, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="datetime" angle={90} height={90}/>
                <YAxis ticks={[-20,0,20,40,60,80]}/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
                <Line type="monotone" dataKey="Humidity" stroke="#82ca9d" />
            </LineChart>
        );
    }
};

class Euler extends React.Component{
    render() {
        return (
            <LineChart
                width={500}
                height={300}
                data={this.props.sensordata}
                margin={{
                    top: 20, right: 50, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="datetime" angle={90} height={90}/>
                <YAxis ticks={[-20,0,20,40,50]}/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="EH" stroke="#8884d8" />
                <Line type="monotone" dataKey="EP" stroke="#82ca9d" />
                <Line type="monotone" dataKey="ER" stroke="#82ca9d" />
            </LineChart>
        );
    }
};


export default App;
