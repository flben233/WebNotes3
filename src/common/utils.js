import {ROOT_DOMAIN} from "@/common/final";

export function setImgElement() {
    let elements = document.getElementsByTagName("img");
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
    // 停止所有已发出的img请求
    if (elements.length > 0) {
        window.stop();
    }
    for (let element of elements) {
        element.setAttribute("loading", "lazy");
        // 刷新img
        element.setAttribute("src", element.src);
        element.setAttribute("use-credentials", element.crossOrigin);
    }
    // 更新深色模式
    window.dispatchEvent(new Event("darkMode"));
}