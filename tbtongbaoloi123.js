const GOOGLE_FORM_URL='https://docs.google.com/forms/d/e/1FAIpQLScNoLPPQusG91XOpuCeM-oRfeUobOyhkYabL-sGWmEvzNB__w/formResponse';const FORM_FIELDS={pagebiloi:'entry.2118620395',errorType:'entry.1083452364',motachitiet:'entry.1664222219'};const STORAGE_KEY='errorReportDraft';const CACHE_DURATION=30000;document.getElementById("tbtong").innerHTML=`
<div class="tbtong">
  <div class="thongbaoblog-header">
    <div class="thongbaoblog-badge">Lưu ý:</div>
  </div>
  
  <div class="thongbaoblog-content">
    <div class="thongbaoblog-title">
      💗 Nếu lỗi - Hãy dùng trình duyệt Google Chrome
    </div>
    
    <ul class="thongbaoblog-list">
      <li class="thongbaoblog-item">Trải nghiệm tốt nhất với Google Chrome</li>
      <li class="thongbaoblog-item">Website hoạt động mượt mà và ổn định hơn</li>
      <li class="thongbaoblog-item">Hỗ trợ tốt các tính năng tạo ảnh, tải ảnh, và làm mờ</li>
    </ul>
        <div class="thongbaoblog-title">
      💗 Không mở link từ facebook, zalo... nếu không sẽ bị lỗi tạo ảnh, tải ảnh
    </div>
	        <div class="thongbaoblog-title">
      💗 Không ĐĂNG NHẬP - CÀI ĐẶT bất cứ gì ở quảng cáo.
    </div>
    <div class="button-wrapper">
      <a class="btnthongbao" href="https://www.facebook.com/taoanhfree/" target="_blank"><i class="fa-brands fa-facebook"></i>
        Liên hệ Facebook
      </a>
	        <a class="btnthongbao"  href="https://www.tiktok.com/@taoanhfree11" target="_blank"><i class="fa-brands fa-facebook"></i>
        Theo dõi TikTok
      </a>
    </div>
  </div>
</div>
`;function openPopup(){const overlay=document.getElementById('overlaybloi');const pagebiloi=document.getElementById('pagebiloi');overlay.classList.add('active');pagebiloi.value=window.location.href;restoreFormData();document.getElementById('formnd').style.display='block';document.getElementById('thanhcongMessage').classList.remove('active')}
function closePopup(){document.getElementById('overlaybloi').classList.remove('active')}
document.getElementById('overlaybloi').addEventListener('click',function(e){if(e.target===this){closePopup()}});function luuFormData(){const formData={errorType:document.getElementById('errorType').value,motachitiet:document.getElementById('motachitiet').value,timestamp:Date.now()};try{window.errorFormDraft=formData}catch(e){console.error('Error saving form data:',e)}}
function restoreFormData(){try{const data=window.errorFormDraft;if(data&&Date.now()-data.timestamp<CACHE_DURATION){document.getElementById('errorType').value=data.errorType||'';document.getElementById('motachitiet').value=data.motachitiet||''}else{clearFormData()}}catch(e){console.error('Error restoring form data:',e)}}
function clearFormData(){window.errorFormDraft=null}
async function baoloiiiii(e){e.preventDefault();const submitBtn=document.getElementById('submitBtn');submitBtn.disabled=!0;submitBtn.textContent='Đang gửi...';const formData=new FormData();formData.append(FORM_FIELDS.pagebiloi,document.getElementById('pagebiloi').value);formData.append(FORM_FIELDS.errorType,document.getElementById('errorType').value);formData.append(FORM_FIELDS.motachitiet,document.getElementById('motachitiet').value);try{await fetch(GOOGLE_FORM_URL,{method:'POST',mode:'no-cors',body:formData});document.getElementById('formnd').style.display='none';document.getElementById('thanhcongMessage').classList.add('active');clearFormData();document.getElementById('errorForm').reset();setTimeout(()=>{closePopup()},5000)}catch(error){alert('Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại!');console.error('Submission error:',error)}finally{submitBtn.disabled=!1;submitBtn.textContent='Gửi'}}
document.addEventListener('keydown',(e)=>{if(e.key==='Escape'){closePopup()}})
