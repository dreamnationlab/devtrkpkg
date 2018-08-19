var _searchRowLimit = 30; //검색 최대개수
var _numLimit       = 30; //검색 숫자 최대 수 제한.
var REG_alphanumeric = /^[A-Za-z0-9]*$/ ; //영어,숫자만


/**
 *
 ***********   search box  ***********
 *
 **/

//추가
function addNum(target) {
  var tg = $(target);
  var li = tg.parents("li");
  var idx = li.index();
  var addList = `
    <li><span class="numbering"></span>
      <span class="tracking_num"><input type="text" class="" id="" name="" value="" maxlength="30" placeholder="Enter your Tranking Numbers" onkeyup="addNum(this)" /></span>
      <span class="del"><button type="button" onclick="deleteNum(this);">X</button></span></li>
    `;
  // 엔터 키 눌렀을 때
  window.event.preventDefault();
  if (window.event.keyCode === 32) {  ////////////////////////엔터키 일 경우 모바일에서 조작어려움 있음. ','로 변경 해도 될지 회의.
    //event.preventDefault();
    if(!tg.val()) {
      alert("값을 입력 해 주세요.");
      tg.focus();
      return false;
    }
    if( (idx+1) >= _searchRowLimit ) {
      alert("최대 " + _searchRowLimit + "개 까지 검색하실 수 있습니다.");
      return false;
    }

    tg.attr("readonly",true);
    $("#searchForm .number_list").append(addList);
    renumbering();
  }
}

//삭제
function deleteNum(target) {
  var lastIndex = $("#searchForm .number_list li:last-child").index();
  var li = $(target).parents("li");
  var idx = li.index();
  var ipt = li.find("input[type=text]");
  if(lastIndex <= 0) {
    ipt.val("");
    ipt.attr("readonly",false);
    ipt.focus();
    return false;
  } else {
    $("#searchForm .number_list li").eq(idx).remove();
  }
  renumbering();
}


//숫자 재배치
function renumbering() {
  $("#searchForm .number_list li").each(function() {
    var tg = $(this);
    var idx = tg.index();
    tg.find(".numbering").text( (idx+1) + "." );
    tg.find("input").attr("name", "trackingNum" + (idx+1) );
  });
  $("#searchForm .number_list li:last-child input[type=text]").focus();
}


//숫자,영어만 입력 체크
function charCheck(target) {
  var res = true;
	if(!REG_alphanumeric.test(target.value)) {
		alert('영문과 숫자로만 입력하세요.');
		target.focus();
		res = false;
  }
	return res;
}

//submit check
function checkSearch() {
  var check = false;
  var nums = "";
  var inputObj = $("#searchForm input[name=trackingNums]");
  inputObj.val(nums);
  $("#searchForm input").each(function(index){
    var value = $(this).val();
    if (value != "") {
      nums += value + "|" ;
    }
  });

  if(nums != "") {
    nums = nums.substring(0, nums.length-1);
    inputObj.val(nums);
    check = true;
  } else {
    alert("Enter Your Tracking Number!!");
    $("#searchForm input[name=trackingNum1]").focus();
    check = false;
  }

  if(check) $("#load").show();

  return check;
}


/**
 *
 ***********   result card  ***********
 *
 **/

//삭제
function removeCard(target) {
  var idx = $(target).parents(".card").index();
  var lastIdx = $(".card_container .card:last-child").index();
  if(lastIdx > 0) {
    $(".card_container .card").eq(idx).remove();  /////////////////////최소 1개는 남겨둠. 이벤트 처리 어떻게?? alert?? -->홈화면으로 이동
  }
}

//클립보드 복사 (copy_linke, copy_result)
function copyText(str) {
  str = strReplaceAll((""+str), "<br>", "\n");
  var $temp = $("<textarea>");
  $("body").append($temp);
  $temp.val(str).select();
  document.execCommand("copy");
  $temp.remove();
  alert("Copied successfully, the text has been added to the clipboard");
}
//문자 치환
function strReplaceAll(str, searchStr, replaceStr) {
  return str.split(searchStr).join(replaceStr);
}
