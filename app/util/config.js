export const getEnv = () => {
    /* eq：
        pre-baoding-jxjy.gaodun.com 
        t-baoding-jxjy.gaodun.com
        baoding-jxjy.gaodun.com
        pre-jxjy.gaodun.com
        t-jxjy.gaodun.com
        jxjy.gaodun.com
    */
    let host = location.host;

    let env = host.match(/[^\-]*-/);
    // let env = host.match(/^[^(\-)]*-/);

    // 开发环境
    if (env === null || env[0] == 'dev-') {
        return 't-';
    }

    // 正式环境
    if (env[0] != 'dev-' && env[0] != 't-' && env[0] != 'pre-') {
        return '';
    }
    
    // 测试、pre
    return env[0]
}
export const PROM = {
    loading: "loading..."
}
