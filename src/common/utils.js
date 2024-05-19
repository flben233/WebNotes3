import {ROOT_DOMAIN} from "@/common/final";

export function setImgElement() {
    // let elements = document.getElementsByTagName("img");
    let cookies = document.cookie.split(";");
    let saToken = null;
    for (let cookie of cookies) {
        if (cookie.includes("satoken")) {
            saToken = cookie.split("=");
            document.cookie = "satoken=" + saToken[1] + ";domain=." + ROOT_DOMAIN + ";max-age=5";
            setInterval(() => {
                document.cookie = "satoken=" + saToken[1] + ";domain=." + ROOT_DOMAIN + ";max-age=5";
            }, 5000);
            break;
        }
    }
    // 更新深色模式
    window.dispatchEvent(new Event("darkMode"));
}