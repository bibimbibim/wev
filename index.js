const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function run() {
    let dictURL = {};

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1280,
        height: 1280,
    });

    await page.goto("https://weverse.io", { waitUntil: "networkidle2" });

    const id = "letsgo2310@protonmail.com";
    const pw = "gogo2020!";

    // 로그인
    await page.click(
        "#root > div.App > div > div.GlobalLayoutView_header__1UkFL > header > div > a"
    );
    await page.waitForSelector(
        "#__next > div > div.sc-fdeced8b-3.fuepEy > form > div > div.sc-ed52fcbe-8.bhRZmA > input"
    );
    await page.type(
        "#__next > div > div.sc-fdeced8b-3.fuepEy > form > div > div.sc-ed52fcbe-8.bhRZmA > input",
        id
    );
    await page.keyboard.down("Enter");

    await page.waitForSelector(
        "#__next > div > div.sc-fdeced8b-3.fuepEy > div > form > div.sc-d0f94a43-0.bCrkf > div > div.sc-ed52fcbe-8.eoxMAH > input"
    );
    await page.type(
        "#__next > div > div.sc-fdeced8b-3.fuepEy > div > form > div.sc-d0f94a43-0.bCrkf > div > div.sc-ed52fcbe-8.eoxMAH > input",
        pw
    );
    await page.keyboard.down("Enter");

    await page.waitForNavigation();
    await page.goto("https://weverse.io/fromis9/live/2-119928500");

    page.on("response", (res) => {
        const url = res.url();
        if (url.includes("https://global.apis.naver.com/rmcnmv/rmcnmv/")) {
            console.log(url);
            fetch_vid_link(url);
        }
    });

    const fetch_vid_link = async (value) => {
        console.log("링크 주소", value);

        const response = await fetch(value);
        const result = await response.json();
        console.log(result["videos"]["list"]);

        const video_list = result["videos"]["list"];
        video_list.forEach((vid) => {
            console.log(vid.encodingOption.name);
            const opt = vid.encodingOption.name;
            dictURL[opt] = vid.source;
        });
        console.log("이거임", dictURL);
    };

    return dictURL;
}

app.get("/", (req, res) => {
    res.send("연결 성공!");
});

app.get("/api/url/:url", (req, res) => {
    const url = req.params.url;
    const info = run();
    console.log(url, info);

    res.json({
        url: info,
    });
});

const port = 8000;
app.listen(port, () => {
    console.log(`서버 ${port}에서 실행 중..`)
})