const path  = 'localhost';
export const Fetch = {
  getPriceItemByid(section, callBack) {
    $.get('http://' + path + ':8080/getItemByIndex', {index: section}, function (data) {
      callBack(data);
    })
  },

  downloadExcel(arr, callBack) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + path + ":8080/getExcel", true); // 也可以使用POST方式，根据接口
    xhr.responseType = "blob"; // 返回类型blob，XMLHttpRequest支持二进制流类型
    xhr.onload = function() {
      callBack();
      if (this.status === 200) {
        let blob = this.response; //使用response作为返回，而非responseText
        let reader = new FileReader();
        reader.readAsDataURL(blob); // 转换为base64，可以直接放入a标签href
        reader.onload = function(e) {
          // 转换完成，创建一个a标签用于下载
          let a = document.createElement("a");
          a.download = "石油化工安装工程概算工作表.xls";
          a.href = e.target.result;
          a.click();
        };
      }
    };
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send("indexArray=" + arr.toString() + "&username=" + window.sessionStorage.getItem('name'));
  },

  uploadFile(file, success, failed) {
    // 设置formData
    let formData = new FormData();
    formData.append('file', file, window.encodeURI(file.name));
    // 设置XHR
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://' + path + ':8080/uploadFile', true);
    // 设置超时
    xhr.timeout = 3000;

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        success();
      } else {
        failed();
      }
    }, false);

    xhr.send(formData);
  },

  setFactorDate(date, callBack=() => {}) {
    let username = window.sessionStorage.getItem('name');
    $.post('http://' + path + ':8080/setFactorDate', {factorDate: date, username: username}, function () {
      callBack();
    });
  },

  removeDate(date, callBack) {
    $.post('http://' + path + ':8080/removeFactorDate', {factorDate: date}, function () {
      callBack();
    });
  },

  login(username, password, callBack) {
    $.post('http://' + path + ':8080/login', {username: username, password: password}, function (data) {
      callBack(data);
    });
  },

  register(username, password, code, callBack) {
    $.post('http://' + path + ':8080/register', {username: username, password: password, code: code}, function (data) {
      callBack(data);
    });
  }

};

