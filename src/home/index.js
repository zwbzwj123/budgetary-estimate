import React from 'react';
import './home.scss';
import {Fetch} from "../fetch";


export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unfold: [false, false, false, false, false, false, false, false, false, false],
      recordList: [],
      tableUnfold: [false, false, false, false, false, false, false, false, false],
      itemArray: [],
      showWarp: false,
      uploadBtnText: '请选择文件',
      btnClicked: false,
      downloadClicked: false,
      factorDate: [],
      useDate: '',
      isUpload: false
    }
  }

  titleOnClick(index) {
    let isUnfold = this.state.unfold[index];
    let unfold = [false, false, false, false, false, false, false, false, false, false];
    unfold[index] = !isUnfold;
    this.setState({
      unfold,
      tableUnfold: [false, false, false, false, false, false, false, false, false],
      recordList: []
    })
  }

  subTitleOnClick(index, i) {
    let isUnfold = this.state.tableUnfold[i];
    let tableUnfold = [false, false, false, false, false, false, false, false, false];
    tableUnfold[i] = !isUnfold;
    if (tableUnfold[i]) {
      Fetch.getPriceItemByid((index + 1) + '-' + (i + 1), (data) => {
        this.setState({
          tableUnfold,
          recordList: data
        })
      });
    } else {
      this.setState({
        tableUnfold
      })
    }
  }

  addItem(item) {
    let arr = this.state.itemArray;
    let _index = arr.indexOf(item);
    if (_index === -1){
      arr.push(item);
      arr.sort();
      this.setState({
        itemArray: arr
      })
    } else {
      alert('该指标号已被添加！')
    }
  }

  removeItem(item) {
    let arr = this.state.itemArray;
    let _index = arr.indexOf(item);
    arr.splice(_index,1);
    this.setState({
      itemArray: arr
    })
  }

  downloadFile() {
    if (!this.state.downloadClicked) {
      this.setState({
        downloadClicked: true
      });
      let arr = [];
      this.state.itemArray.forEach((item) => {
        arr.push(item.split('___')[0]);
      });
      Fetch.downloadExcel(arr, () => {
        this.setState({
          downloadClicked: false
        });
      });
    }
  }

  getFile(e) {
    const file = e.target.files[0];
    const data = {
      file,
      name: file ? file.name : this.state.uploadBtnText
    };
    this.fileData = data;
    this.setState({
      uploadBtnText: data.name.length > 16 ? data.name.slice(0, 16) + '...' : data.name
    });
  }

  showWarp() {
    Fetch.getPriceItemByid('factorDate', (data) => {
      let dates = data[0].factor ? data[0].factor.split('/') : [];
      dates.pop();
      this.setState({
        factorDate: dates.sort()
      })
    });
    this.setState({
      showWarp: true
    })
  }

  isUpload() {
    this.setState({
      isUpload: true
    })
  }

  chooseDate(date) {
    Fetch.setFactorDate(date, () => {
      window.sessionStorage.setItem('factorDate', date);
      this.setState({
        useDate: date,
        showWarp: false
      });
    });
  }

  removeDate(date) {
    let rs = confirm('确认要删除该期调整系数？');
    if (rs) {
      let newFactorDate = this.state.factorDate;
      let index = newFactorDate.indexOf(date);
      newFactorDate.splice(index, 1);
      Fetch.removeDate(date, () => {
        if (date === this.state.useDate) {
          Fetch.setFactorDate('');
          window.sessionStorage.setItem('factorDate', 'null');
          this.setState({
            useDate: 'null'
          })
        }
        this.setState({
          factorDate: newFactorDate
        })
      })
    }
  }

  confirmBtn() {
    let data = this.refs.file;
    if (!data.files[0]) {
      alert('请选择文件！');
      return;
    }
    if (!this.state.btnClicked) {
      this.setState({
        btnClicked: true
      });
      Fetch.uploadFile(data.files[0], () => {
        this.setState({
          uploadBtnText: '请选择文件',
          showWarp: false,
          btnClicked: false
        });
        window.location.reload();
        alert('更新成功！');
      }, () => {
        this.setState({
          uploadBtnText: '请选择文件',
          showWarp: false,
          btnClicked: false
        });
        alert('更新失败，请确认文件内容格式是否正确！');
      })
    }
  }

  componentDidMount() {
    this.setState({
      useDate: window.sessionStorage.getItem('factorDate')
    })
  }

  render() {
    if (window.sessionStorage.getItem("name") == null) {
      window.location.href = window.location.origin + "/login"
    }
    let priceItem = this.state.recordList.map((item, i) => {
      let factor = '';
      if (item.factor == null) {
        factor = 0;
      } else {
        let factorArr = item.factor.split('/');
        for (let i = 0; i < factorArr.length; i++) {
          if (factorArr[i].indexOf(this.state.useDate) !== -1) {
            factor = parseFloat(factorArr[i].split('__')[1]);
            break;
          }
        }
        if (factor === '') {
          factor = 0;
        }
      }
      return <tr key={i} style={{height: '45px'}}>
        <td>{item.index}</td>
        <td>
          {item.name}
          {this.state.useDate !== '' && factor !== 0 ? '（主材*' + factor + '不含税系数）' : ''}
        </td>
        <td>{item.measure}</td><td>{item.cost}</td><td>{this.state.useDate !== '' && factor !== 0 ? (factor*item.cost).toFixed(2) : '——'}</td>
        <td>{item.setupCost}</td><td>{item.laborCost}</td><td>{item.extraCost}</td><td>{item.machineryCost}</td>
        <td className="add2excel"><span className="iconfont icon-add2" onClick={() => this.addItem(item.index + "___" + item.name)}/></td>
      </tr>
    });

    let chapterItem = CHAPTERS.map((item, index) => {
      let subTitle = item.subTitle.map((title, i) => {
        return (
        <div className={
          `sub-section ${this.state.unfold[index] ? 'unfold-section' : 'fold-section'}`
        } key={i}>
          <span onClick={() => this.subTitleOnClick(index, i)}>{title}</span>
          <table className={`${this.state.tableUnfold[i] ? 'unfold-table' : 'fold-table'}`}>
            <thead>
              <tr>
                <th>指标编号</th><th>指标名称</th><th>单位</th><th>主材费</th><th>调整主材费</th>
                <th>安装费</th><th>其中人工费</th><th>其中辅材费</th><th>其中机械费</th>
              </tr>
            </thead>
            <tbody>
              {priceItem}
            </tbody>
          </table>
        </div>
        );
      });
      return <div key={index} className="section-title">
        <span onClick={() => this.titleOnClick(index)}>{item.title}</span>
        {subTitle}
      </div>;
    });

    let indexArray = this.state.itemArray.map((item, i) => {
      return <tr key={i} style={{height: '45px'}}>
        <td>{item.split('___')[0]}</td><td>{item.split('___')[1]}</td>
        <td className="remove"><span className="iconfont icon-remove2" onClick={() => this.removeItem(item)}/></td>
      </tr>
    });

    let factorDateList = this.state.factorDate.map((item, index) => {
      return <div className="factor-table" key={index}>
        <span className="date" onClick={() => this.chooseDate(item)}>
          {item.split('_')[0] + '年' + item.split('_')[1] + '期'}
        </span>
        <span className="iconfont icon-remove2" onClick={() => this.removeDate(item)}/>
      </div>;
    });

    let downloadBtn = <td className="preview-btn" colSpan="2"><span onClick={() => this.downloadFile()}>导出</span></td>;

    return (
      <div className="home">
        <div className="header" id="headerBanner">
          <div className="title">
            <div className="logo"/>
            <span>石油化工安装工程概算编制应用数据库</span>
          </div>
        </div>
        {
          window.sessionStorage.getItem('isRoot') ?
            <div className="update-btn" onClick={() => this.isUpload()}>添加调整系数</div> : ''
        }
        <div className="choose-btn" onClick={() => this.showWarp()}>选择调整系数</div>
        {
          this.state.useDate === 'null' ?
            <div className="use-date">
              （当前调整系数为：未选择）
            </div> :
            <div className="use-date">
              （当前调整系数为：{this.state.useDate.split('_')[0] + '年' + this.state.useDate.split('_')[1] + '期'}）
            </div>
        }

        <div className="content">
          <div className="tree">
            <div className="section">
              {chapterItem}
            </div>
          </div>
          <div className="form">
            <table>
              <thead>
                <tr>
                  <th>指标编号</th>
                  <th>指标名称</th>
                  <th className="remove"/>
                </tr>
              </thead>
              <tbody>
                {indexArray}
                {
                  this.state.itemArray.length > 0 ? <tr>{downloadBtn}</tr> : <tr/>
                }
              </tbody>
            </table>
          </div>
        </div>
        {
          this.state.showWarp ?
            <div className="shade-wrap">
              <div className="preview-wrap">
                <div className="preview-header">
                  <span className="preview-way">选择调整系数</span>
                  <span className="iconfont icon-close" id="close" onClick={() => this.setState({showWarp: false})}/>
                </div>
                <div className="wrap-content">
                  {
                    factorDateList.length > 0 ? factorDateList
                      : <div style={{margin: '8px 0 0 20px'}}>
                        请添加调整系数！
                      </div>
                  }
                </div>
              </div>
            </div> : ''
        }
        {
          this.state.isUpload ?
            <div className="shade-wrap">
              <div className="preview-wrap">
                <div className="preview-header">
                  <span className="preview-way">添加调整系数</span>
                  <span className="iconfont icon-close" id="close" onClick={() => this.setState({isUpload: false})}/>
                </div>
                <div className="wrap-content">
                  <label>
                    <input
                      type="file"
                      name="uploading"
                      ref="file"
                      onChange={(e) =>this.getFile(e)}
                      style={{ display: 'none' }}
                      accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    />
                    <div className={`file-btn ${this.fileData ? 'file-fill' : ''}`}>
                      {this.state.uploadBtnText}
                    </div>
                  </label>
                  <div className="confirm-btn" onClick={() => this.confirmBtn()}>
                    <div>提交</div>
                  </div>
                </div>
              </div>
            </div> : ''
        }

      </div>
    );
  }
}
const CHAPTERS = [
  {
    'title': '第一章 设备安装工程',
    'subTitle': [
      '第一节 塔、器安装',
      '第二节 机械设备安装',
      '第三节 蒸汽锅炉安装',
      '第四节 设备填充',
      '第五节 独立钢烟囱组对安装、钢烟道制作安装',
      '第六节 火炬、排气筒制作安装',
      '第七节 金属结构制作安装',
      '第八节 料斗料仓制作安装',
      '第九节 设备专用衬里及龟甲网安装'
    ]
  },
  {
    'title': '第二章 工艺管道安装',
    'subTitle': [
      '第一节 化工工艺管道安装',
      '第二节 炼油工艺管道',
      '第三节 阀门安装',
      '第四节 波纹补偿器安装',
      '第五节 弹簧支吊架安装和金属管架制作安装'
    ]
  },
  {
    'title': '第三章 金属储罐、球形罐、气柜制作安装工程',
    'subTitle': [
      '第一节 金属储罐制作安装',
      '第二节 球形罐组对安装',
      '第三节 气柜制作安装'
    ]
  },
  {
    'title': '第四章 电气安装工程',
    'subTitle': [
      '第一节 变配电设备安装',
      '第二节 线路敷设及其它',
      '第三节 电动机检查接线及系统调试',
      '第四节 照明及防雷接地'
    ]
  },
  {
    'title': '第五章 自控仪表安装工程',
    'subTitle': [
      '第一节   过程检测仪表安装',
      '第二节   显示调节仪表安装',
      '第三节   执行仪表安装',
      '第四节   机械量仪表安装',
      '第五节   分析仪表安装',
      '第六节   安全监测装置与信号报警装置安装',
      '第七节   工业计算机设备安装',
      '第八节   仪表盘、柜、箱安装',
      '第九节   自控主要材料安装'
    ]
  },
  {
    'title': '第六章   工业炉安装工程',
    'subTitle': [
      '第一节   炼油工业炉金属结构制作安装和炉管安装',
      '第二节  化工工业炉金属结构制作安装和炉管安装',
      '第三节   配件安装',
      '第四节   炉窑砌筑',
      '第五节   衬里、隔热'
    ]
  },
  {
    'title': '第七章   给排水安装工程',
    'subTitle': [
      '第一节   厂区生产设施管道安装',
      '第二节   厂区办公和生活福利设施管道安装',
      '第三节   冷却塔安装',
      '第四节   给排水专用机械安装',
      '第五节   阀门安装',
      '第六节   卫生器具安装',
      '第七节   消防设施安装'
    ]
  },
  {
    'title': '第八章   采暖、通风、空调安装工程',
    'subTitle': [
      '第一节    采暖安装',
      '第二节    通风空调安装'
    ]
  },
  {
    'title': '第九章   隔热、防腐工程',
    'subTitle': [
      '第一节   隔热',
      '第二节   除锈',
      '第三节   防腐',
      '第四节   管道清洗、脱脂'
    ]
  },
  {
    'title': '第十章   电信安装工程',
    'subTitle': [
      '第一节   工厂通讯设备安装',
      '第二节   火灾报警系统安装与调试',
      '第三节   防爆工业电视监控系统安装与调试',
      '第四节   电信线路敷设'
    ]
  },
];