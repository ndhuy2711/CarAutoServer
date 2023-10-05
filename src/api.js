const axios = require('axios');
const express = require('express')
const qs = require("qs")
const { constant } = require("../const.js")
const fs = require('fs');
const https = require('https');
const serverless = require('serverless-http')

const app = express()
const router = express.Router()

router.get("/", (req, res) => {
    setInterval(async () => {
        const data = await start() // Dữ liệu ngẫu nhiên, bạn có thể thay thế bằng dữ liệu thực tế từ máy chủ của bạn
        // .then((result) => {
        // console.log(data);
        res.write(`data: ${data}\n\n`); // Dùng dấu "\n\n" để kết thúc mỗi message SSE
        // });
        // data()
    }, 5000);
})

let token = ""
const start = async () => {
    const checkFile = await checkFileFc()

    //Check exist File Key.txt & create file if it don't exist
    if (checkFile) {
        const checkTokenFile = await checkTokenFileFc()
        if (checkTokenFile !== "") {
            const _dataAdt = await untils(checkTokenFile)
            if (_dataAdt == 401) {
                const _getAccessToken = await getAccessToken()
                const result = await untils(_getAccessToken)
                fs.writeFile('./Key.txt', _getAccessToken, err => {
                    if (err) {
                        console.error(err)
                    }
                });
                return result
            }
            console.log(_dataAdt);
            return JSON.stringify(_dataAdt.value[0])
        }
    } else {
        const _getAccessToken = await getAccessToken()
        await getDataAdt(_getAccessToken)
        const result = await untils(_getAccessToken)
        fs.writeFile('./Key.txt', _getAccessToken, err => {
            if (err) {
                console.error(err)
            }
        });
        return result
    }
}

//Check exist File Key.txt
const checkFileFc = async () => {
    if (fs.existsSync('./Key.txt')) {
        return true
    } else {
        return false
    }
}
//Check Access Token in File Key.txt
const checkTokenFileFc = async () => {
    const token = fs.readFileSync('./Key.txt', 'utf8')
    return token
}

//Get data Access Token
const getAccessToken = async () => axios.post(constant.apiGetToken, qs.stringify(constant.dataGetAccessToken))
    .then((data) => {
        return token = data?.data?.access_token || "";
    })
    .catch((err) => err)

// Get data from ADT
const getDataAdt = async (token) => axios.post(`${constant.apiGetData}/query?api-version=2020-10-31`, {
    "query": "SELECT * FROM DIGITALTWINS"
}, {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Access-Control-Allow-Origin': '*',
    }
}
)
    .then(response => response?.data)
    .catch(err => err)

//Funtion untils
const untils = async (token) => {
    const _getDataAdt = await getDataAdt(token)
    const _dataAdt = _getDataAdt?.response?.data?.statusCode || _getDataAdt
    // console.log("_dataAdt :", _dataAdt)
    return _dataAdt
}


// Đường dẫn tới chứng chỉ SSL và khóa riêng tư
// const options = {
//     key: fs.readFileSync('./key.pem'),
//     cert: fs.readFileSync('./cert.pem')
// };

// Tạo server HTTPS thay vì HTTP
// const server = https.createServer(options, (req, res) => {
//     // Thiết lập header để hỗ trợ SSE
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Gửi dữ liệu liên tục sau mỗi 5 giây
//     setInterval(async () => {
//         const data = await start() // Dữ liệu ngẫu nhiên, bạn có thể thay thế bằng dữ liệu thực tế từ máy chủ của bạn
//         // .then((result) => {
//             // console.log(data);
//             res.write(`data: ${data}\n\n`); // Dùng dấu "\n\n" để kết thúc mỗi message SSE
//         // });
//         // data()
//     }, 5000);
// });

// const port = 443; // Sử dụng cổng HTTPS (443)
// server.listen(port, () => {
//     console.log(`Server đang chạy trên cổng ${port}`);
// });

app.use('./netlify/functions/api', router)
module.exports.handler = serverless(app)