const fs = require('fs');
const path = require('path');
const utl = require('./util');

const alipay_gate_way = 'https://openapi.alipay.com/gateway.do';
const alipay_gate_way_sandbox = 'https://openapi.alipaydev.com/gateway.do';

class Alipay {
  constructor (opts) {
    this.appId = opts.appId;
    this.sandbox = !!opts.sandbox;
    this.notifyUrl = opts.notifyUrl;
    this.signType = opts.signType;

    this.rsaPrivate = fs.readFileSync(opts.rsaPrivate, 'utf-8');
    this.rsaPublic = fs.readFileSync(opts.rsaPublic, 'utf-8');
  }

  makeParams (method, biz_content) {
    return {
      app_id: this.appId,
      method: method,
      format: 'JSON',
      charset: 'utf-8',
      sign_type: this.signType,
      timestamp: new Date().format('yyyy-MM-dd hh:mm:ss'),
      version: '1.0',
      biz_content: JSON.stringify(biz_content)
    };
  }

  webPay (opts) {
    const biz_content = {
      body: opts.body,
      subject: opts.subject,
      out_trade_no: opts.outTradeId,
      timeout_express: opts.timeout,
      total_amount: opts.amount,
      seller_id: opts.sellerId,
      product_code: 'QUICK_WAP_PAY',
      goods_type: opts.goodsType,
      passback_params: opts.passbackParams,
      promo_params: opts.promoParams,
      extend_params: opts.extendParams,
      enable_pay_channels: opts.enablePayChannels,
      disable_pay_channels: opts.disablePayChannels,
      store_id: opts.storeId,
    };

    var params = this.makeParams('alipay.trade.wap.pay', biz_content);
    params.notify_url = this.notifyUrl;
    params.return_url = opts.returnUrl;

    return utl.processParams(params, this.rsaPrivate, this.signType);
  }

  signVerify (response) {
    var ret = utl.copy(response);
    var sign = ret['sign'];
    ret.sign = undefined;
    ret.sign_type = undefined;

    var tmp = utl.encodeParams(ret);
    return utl.signVerify(tmp.unencode, sign, this.rsaPublic, this.signType);
  }

  query (opts) {
    var biz_content = {
      out_trade_no: opts.outTradeId,
      trade_no: opts.tradeId
    };

    var params = {
        app_id: this.appId,
        method: 'alipay.trade.query',
        format: 'JSON',
        charset: 'utf-8',
        sign_type: this.signType,
        timestamp: new Date().format('yyyy-MM-dd hh:mm:ss'),
        version: '1.0',
        app_auth_token: opts.appAuthToken,
        biz_content: JSON.stringify(biz_content)
    };
    var params = this.makeParams('alipay.trade.query', biz_content);
    if (this.appAuthToken) {
      params.app_auth_token = this.appAuthToken;
    }

    var body = utl.processParams(params, this.rsaPrivate, this.signType);

    return utl.request({
      method: 'GET',
      url: (this.sandbox? alipay_gate_way_sandbox : alipay_gate_way) + '?' + body
    });
  }

  close (opts) {
    var biz_content = {
      out_trade_no: opts.outTradeId,
      trade_no: opts.tradeId,
      operator_id: opts.operatorId
    };

    var params = this.makeParams('alipay.trade.close', biz_content);
    if (this.appAuthToken) {
      params.app_auth_token = this.appAuthToken;
    }

    var body = utl.processParams(params, this.rsaPrivate, this.signType);

    return utl.request({
      method: 'GET',
      url: (this.sandbox? alipay_gate_way_sandbox : alipay_gate_way) + '?' + body
    });
  }

  refund (opts) {
    var biz_content = {
      out_trade_no: opts.outTradeId,
      trade_no: opts.tradeId,
      operator_id: opts.operatorId,
      refund_amount: opts.refundAmount,
      refund_reason: opts.refundReason,
      out_request_no: opts.outRequestId,
      store_id: opts.storeId,
      terminal_id: opts.terminalId
    };

    var params = this.makeParams('alipay.trade.refund', biz_content);
    if (this.appAuthToken) {
        params.app_auth_token = this.appAuthToken;
    }

    var body = utl.processParams(params, this.rsaPrivate, this.signType);

    utl.request({
        method: 'GET',
        url:  body
    }).then(function (ret) {
        console.log("***** ret.body=" + body);
    });
  }

  refundQuery (opts) {
    var biz_content = {
      out_trade_no: opts.outTradeId,
      trade_no: opts.tradeId,
      out_request_no: opts.outRequestId || opts.outTradeId
    };

    var params = this.makeParams('alipay.trade.fastpay.refund.query', biz_content);
    if (this.appAuthToken) {
      params.app_auth_token = this.appAuthToken;
    }

    var body = utl.processParams(params, this.rsaPrivate, this.signType);

    return utl.request({
        method: 'GET',
        url: (this.sandbox? alipay_gate_way_sandbox : alipay_gate_way) + '?' + body
    });
  }

  billDownloadUrlQuery (opts) {
    var biz_content = {
      bill_type: opts.billType,
      bill_date: opts.billDate
    };

    var params = this.makeParams('alipay.data.dataservice.bill.downloadurl.query', biz_content);
    if (this.appAuthToken) {
        params.app_auth_token = this.appAuthToken;
    }

    var body = utl.processParams(params, this.rsaPrivate, this.signType);

    return utl.request({
        method: 'GET',
        url: (this.sandbox? alipay_gate_way_sandbox : alipay_gate_way) + '?' + body
    });
  }
}

module.exports = Alipay;
