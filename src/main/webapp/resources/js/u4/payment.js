/**
 * Payment JS
 */
function openModal() {
	    const modal = document.querySelector(".js-modal");
	    modal.style.display = "block";
	}
	
	function closeModal() {
	    const modal = document.querySelector(".js-modal");
	    modal.style.display = "none";
	}
	
	function backPage() {
	    history.back();
	}
	
	function bankOpen() {
	    var bankBtn = document.querySelector(".js-bankBtn");
	    var bankPage = document.querySelector("#bankpage");
	    if (bankBtn.checked) {
	        bankPage.classList.add("show");
	    } else bankPage.classList.remove("show");
	}
	
	function countBtn(e, target, x) {
	    const parent = target.parentNode;
	    const count = parent.querySelector(".js-count");
	    if (x === 1) count.value++;
	    else {
	        if (count.value > 1) count.value--;
	    }
	}
$(document).ready(function(){
	cartListView();/*장바구니 뷰*/
	bankView(); /*개인정보뷰*/
	itemListView();/*바로결제 상품리스트*/
	pickCartView();/*장바구니 선택상품 결제리스트*/
	payCB();/*payCB data 변경*/
	setPay();/*결제하기*/
	/*개인정보뷰*/
	function bankView(){
		$.ajax({
			url:"/main/bankView",
			type:"POST"
		}).done(function(d){
				var admin = d.ADMIN;
				var user = d.USER;
				// 배송지
				$("#address1").val(user.address1);
				$("#address2").val(user.address2);
				$("#address3").val(user.address3);
				$("#tel").val(user.tel);
				
				// 무통장 입금
				$("#username").val(user.name);
				$("#depositor").text(admin.depositor);
				$("#bank").text(admin.bank);
				$("#order").attr("data-uno", user.no);
				
	//			$("#address1").val(d[0].address1);
	//			$("#address2").val(d[0].address2);
	//			$("#address3").val(d[0].address3);
	//			$("#tel").val(d[0].tel);
	//			$("#username").val(d[0].name);
	//			$("#depositor").text(d[1].depositor);
	//			$("#bank").text(d[1].bank);
	//			$("#order").attr("data-uno",d[0].no);
			
		});
	}
	/*바로결제 선택상품 결제리스트*/
	function itemListView(){
		$.ajax({
			type: "POST",
			url: "/main/itemListView"
		}).done(function(d,textStatus){
			if(d != ""){
				$("#itemListView").html(d);
				finalPriceView();/*최종금액뷰*/
			}
		});
	};
	
	/*장바구니 전체상품 결제리스트*/
	function cartListView(){
		$.ajax({
			type: "POST",
			url: "/main/cartListView"
		}).done(function(d,textStatus){
	//		if(d == 1){
				$("#itemListView").html(d);
				finalPriceView();/*최종금액뷰*/
	//		}
		});
	}
	
	/*payCB data 변경*/
	function payCB(){
		$(".js-bankBtn").click(function(){
			$("#payCB").val("B");
		})
		
		$("#kakaopay").click(function(){
			$("#payCB").val("C");
		})
	};
	/*최종금액뷰*/
	function finalPriceView(){
		var sum = 0;
		for(var i = 0; i < $("#itemListView").children("ul").length; i++){
	        sum += Number($(".sumPrice").eq(i).attr("data-finalPrice"));
		};
		 $("#finalPrice").attr("data-sumPrice",sum);
		 $("#finalPrice").text("₩"+AddComma(sum));
		
	};
	/*금액3자리에 콤마찍기*/
	function AddComma(num){
	var regexp = /\B(?=(\d{3})+(?!\d))/g;
	return num.toString().replace(regexp, ',');
	}
	
	
	/*결제등록*/
	function setPay(){
		$("#setPay").click(function(){
			console.log("dd");
			var items = [];
			for(var i = 0; i < $("#itemListView").children("ul").length; i++){
				var cno = $(".cno").eq(i).attr("data-cno");
				if(cno === ""){cno = 0;}
				var item = {
					uno : $("#order").attr("data-uno"),
					pno : $(".pno").eq(i).attr("data-pno"),
					cno : cno,
					sname : $(".sname").eq(i).text(),
					color : $(".color").eq(i).text(),
					price : $(".price").eq(i).text(),
					quantity : $(".amount").eq(i).text(),
					sumPrice : $(".sumPrice").eq(i).attr("data-finalprice"),
					payCB : $("#payCB").val(),
					address1 : $("#address1").val(),
					address2 : $("#address2").val(),
					address3 : $("#address3").val(),
					tel : $("#tel").val()
				}
				items.push(item);
			}
			console.log(items);
			var params = {
					item : items
			};
			console.log(items);	
			$.ajax({
				type: "PUT",
				url: "/main/setPay",
				contentType : "application/json; charset=UTF-8",
				data : JSON.stringify(params)
			}).done(function(d){
				location.href = "/main/paymentFinish";
			});
		});
	}
	/*장바구니 선택상품 결제리스트*/
	function pickCartView(){
		$.ajax({
			type: "POST",
			url: "/main/pickCartView"
		}).always(function(d,textStatus){
			if(d != ""){
				$("#itemListView").html(d);
				finalPriceView();/*최종금액뷰*/
			}
		});
	}
})


