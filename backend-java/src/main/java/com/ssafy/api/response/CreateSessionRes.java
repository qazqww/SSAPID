package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("")
public class CreateSessionRes extends BaseResponseBody {
    @ApiModelProperty(name = "", example = "")
    String token;

    public static CreateSessionRes of(Integer statusCode, String message, String token) {
        CreateSessionRes res = new CreateSessionRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setToken(token);
        return res;
    }
}
