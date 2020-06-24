/**
 * 封装adb 常用命令
 */
import { execSync } from 'child_process';
import * as os from 'os';
import * as path from 'path';
import { logger } from '../common/logger';

interface options {
    retryCount?: number
}

export class ADB {

    private _osName: string;
    private static _adb: string = ADB.getAdbPath();
    private _deviceID: string;
    private _beforeConnect: boolean;
    private _afterConnect: boolean;
    private _phoneBrand: string;
    private _phoneModal: string;
    private _sdkVersion: string;

    constructor(deviceId: string) {

        this._deviceID = deviceId;
        this._osName = os.platform();
        this._phoneBrand = '';
        this._phoneModal = '';
        this._sdkVersion = '';
        this._beforeConnect = true;
        this._afterConnect = true;

    }

    public static getAdbPath(): string {
        /**
         * 返回adb的绝对路径。优先使用系统环境变量中配置的adb
         */
        let adb_path = process.env['android_home'];
        let adb = os.platform() == "win32" ? 'adb.exe' : 'adb';
        if (adb_path) {
            adb_path = path.join(adb_path, 'platform-tools', adb);
        } else {
            // TODO 添加本地adb目录路径
            adb_path = path.join(__dirname, '..', '..', "tools", 'adb.exe')
        }

        // 判断系统自带adb是否能用,如果系统有带有的,优先使用系统自带adb
        let cmdline = execSync(adb_path + ' devices');
        let cmdret = cmdline.toString();
        let cmdrets = cmdret.trim().split('\n');

        if (!cmdrets[0].includes('List of devices attached')) {
            // 如果设备没有连接
            console.log('系统没有安装adb工具');
            return '';
        }
        console.log(adb_path)

        return adb_path;
    }

    public static isConnected(deviceId: string): boolean {
        return ADB.listDevices().includes(deviceId)
    }

    public static listDevices(): string[] {
        /**
         * 获取设备列表
         */
        let cmd = this._adb + ' devices';
        let result = execSync(cmd);
        let cmdret = result.toString();

        let cmds = cmdret.trim().split('\n');

        let r = [];
        for (let val of cmds) {
            let v = val.trim().split('\t')
            v.length > 1 ? r.push(v[0]) : '';
        }
        return r;
    }

    public static checkAdbNormal() {
        /**
         * 检查adb服务是否正常
         */
        let sub = execSync(this._adb + ' devices').toString();
        logger.debug(`adb devices: ${sub}`)
        if (!sub) {
            logger.debug(`没有设备连接`);
            return true
        } else {
            if (sub.includes('daemon not running.')) {
                logger.warn('adb服务启动异常')
                return false
            } else if (sub.includes("ADB server didn't ACK")) {
                logger.warn("error: ADB server didn't ACK,kill occupy 5037 port process")
                return false;
            } else {
                return true;
            }
        }



    }

    public static killServer() {
        logger.warn('kill-server')
        execSync(`${this._adb} kill-server`)
    }

    public static startServer() {
        ADB.killOccpu5037Process();
        logger.warn('fork server');
        execSync('adb start-server');
    }

    public static killOccpu5037Process() {
        // TODO
    }

    private runCmdOnce(cmd: string, ...restargs: string[]) {
        /**
         * 执行单次命令
         */
        let cmdlet = `${ADB._adb} -s ${this._deviceID} ${cmd}`;
        logger.debug(`${cmdlet.toString()}`);
        return execSync(cmdlet.toString());

    }

    public runAdbCmd(cmd: string, runconfig?: options, ...restargs: string[]) {
        /**
         * 执行adb命令
         * 默认执行测试为3次
         */
        let retry_count = runconfig?.retryCount ? runconfig.retryCount : 3
        let ret;
        while (retry_count > 0) {
            ret = this.runCmdOnce(cmd, ...restargs)
            ret = ret.toString();
            logger.debug(`执行结果为: ${ret.toString()}`)
            if (ret !== null) {
                break;
            }
            retry_count = retry_count - 1
        }
        return ret;
    }

    /**
     * 执行shell命令
     * @param cmd 
     * @param restargs 
     */
    public runShellCmd(cmd: string, runconfig?:options, ...restargs: string[]):string {
        // TODO 如果失去连接又连接成功了
        try {
            let ret = this.runAdbCmd('shell '+cmd, runconfig, ...restargs);
            logger.info(`执行${cmd}: 结果 ${ret}`) 
            if(ret == null){
                logger.error(`执行命令错误：${cmd}`)
            }
            return ret
        } catch (error) {
            return '';
        }   
        
    }

    /**
     * 运行logcat进行
     * @param saveDir 
     * @param processList 
     * @param params 
     */
    public startLogcat(saveDir:string,processList=[],params=''){

    }

    /**
     * 从电脑中copy文件到手机中
     * @param sourcePath 电脑文件路径
     * @param destPath 手机文件路径
     */
    public pushFile(sourcePath:string,destPath:string){

    }

    /**
     * 从手机中复制文件到电脑中
     * @param sourcePath 手机文件路径
     * @param destPath 电脑文件路径
     */
    public pullFile(sourcePath:string,destPath:string){

    }

    /**
     * 手机截图
     * @param savePath 
     */
    public screencap(savePath:string){
        return this.runShellCmd(`screencap -p ${savePath}`)
    }

    /**
     * 删除目录
     * @param folderPath 手机文件目录
     */
    public deleteFolder(folderPath:string){
        this.runShellCmd(`rm -R ${folderPath}`)
    }

    /**
     * 删除文件
     * @param filePath 文件目录
     */
    public deleteFile(filePath:string){
        this.runShellCmd(`rm ${filePath}`)
    }
    /**
     * 列出目录中文件
     * @param dirPath 目录路径
     */
    public listDir(dirPath:string){
        let result = this.runShellCmd(`ls ${dirPath}`)
        console.log('result',result?.toString());
        if(!result){
            return "";
        }
        let res = result.toString().replace('\r\r', '\n');
        if (res.includes('No such file or directory')){
            logger.error(`文件(夹)${dirPath}不存在`);
        }
        let r = res.split('\n');
        let list = r.map(line=>{
            let items = line.split(' ')
            if(items[0]!="total" && items.length != 2){
                return items[items.length-1];
            }
        })
        return list;
    }

    /**
     * 列出目录路径下开始时间和结束时间之间的文件
     * @param dirPath 目录路径
     * @param startTime 开始时间
     * @param endTime 结束时间
     */
    public listDirBetweenTime(dirPath:string,startTime:string,endTime:string){

    }

    /**
     * 启动应用名称
     * @param activityName 应用名称
     */
    public startActivity(activityName:string){

    }

    /**
     * 获取前台activity页面名称
     */
    public getFocuseActivity(){

    }

    /**
     * 获取Android 在休眠期间app的活跃程度
     */
    public getTopActivityWithUsageStats(){
        // cmd: dumpsys usagestats
    }

    /**
     * 根据应用中获取PID值
     * @param packageName 应用的包名
     */
    public getPidFromPackage(packageName:string):string{
        return '';
    }



    /**
     * 获取当前系统版本号
     */
    public getSystemVersion(){
        return this.runShellCmd('getprop ro.build.version.release');
    }

    /**
     * 获取UUID
     */
    public getGenieUUID(){
        return this.runShellCmd('getprop ro.genie.uuid');
    }

    /**
     * 获取应用的详细包名信息
     * @param packageName 应用包名
     */
    public getPackageMsg(packageName:string){
        return this.runShellCmd(`dumpsys package ${packageName}`)
    }

    public getAndroidVersion(){
        return this.runShellCmd('getprop ro.build.version.release')
    }

    /**
     * sdk版本
     */
    public getSDKVersion(){
        return this.runShellCmd('getprop ro.build.version.sdk')
    }

    /**
     * 获取手机品牌
     */
    public getPhoneBand(){
        return this.runShellCmd('getprop ro.product.model')
    }

    /**
     * 获取屏幕尺寸
     */
    public getScreenSize(){
        return this.runShellCmd('getprop ro.product.screensize')
    }

    /**
     * 获取屏幕分辨率
     */
    public getWMSize(){
        const size:string = this.runShellCmd("wm size")
        const vmsize = size.split(':')[1].trim()
        return vmsize
    }
    
    /**
     * 获取CPU架构信息
     */
    public getCPUAbi(){
        return this.runShellCmd('getprop ro.product.cpu.abi')
    }

    /**
     * 获取CPU型号
     */
    public getCPUModel(){
        return this.runShellCmd('getprop ro.product.board')
    }

    public getTotalMemo(){
        const mem = this.runShellCmd('cat /proc/meminfo')
        const line = mem.split('\n').filter((line)=>{
            if(line.includes('MemTotal')){
                return line
            }
        })
        return line[0].split('MemTotal:')[1];
    }

    /**
     * 获取设备串号
     */
    public getDeviceIMEI(){
        return this.runShellCmd('dumpsys iphonesubinfo')
    }

    /**
     * 获取已安装app列表
     */
    public listInstalledApp(){
        const result = this.runShellCmd('pm list packages');
        const applist = result?.split('\n')
        return applist?.map(app=>app.trim().split(':')[1])
    }

}
