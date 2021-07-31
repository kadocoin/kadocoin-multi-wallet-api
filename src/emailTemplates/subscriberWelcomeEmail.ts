import { NEXT_JS_APP_ADDRESS } from '../config/secret';
import emailFooter from './emailFooter';
import emailHeader from './emailHeader';
import { tableRow, tableRowAlwaysHappy, tableRowCheers } from './table';

export function subscriberWelcomeEmail(token: { _id: string }, email: string): string {
  return `
  ${emailHeader()}
      <table class="es-content" cellspacing="0" cellpadding="0" align="center"
         style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
         <tr style="border-collapse:collapse">
            <td align="center" style="padding:0;Margin:0">
               <table class="es-content-body"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:640px"
                  cellspacing="0" cellpadding="0" align="center">
                  <tr style="border-collapse:collapse">
                     <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px">
                        <table width="100%" cellspacing="0" cellpadding="0"
                           style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr style="border-collapse:collapse">
                              <td valign="top" align="center" style="padding:0;Margin:0;width:600px">
                                 <table
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-radius:3px;background-color:#FFFFFF"
                                    width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff" role="presentation">
                                    <tr style="border-collapse:collapse">
                                       <td align="center"
                                          style="Margin:0;padding-bottom:5px;padding-left:20px;padding-right:20px;padding-top:25px">
                                          <h2
                                             style="Margin:0;line-height:34px;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-size:28px;font-style:normal;font-weight:bold;color:#444444">
                                             Welcome New Subscriber!</h2>
                                       </td>
                                    </tr>
                                    
                                    ${tableRow(
                                      'Thank you for subscribing. To complete the process, please click below:'
                                    )}

                                    <tr style="border-collapse:collapse">
                                       <td align="center"
                                          style="Margin:0;padding-left:10px;padding-right:10px;padding-top:15px;padding-bottom:25px">
                                          <span class="es-button-border"
                                             style="border-style:solid;border-color:#4f46e5;background:#4f46e5;border-width:1px;display:inline-block;border-radius:28px;width:auto"><a
                                               href="${NEXT_JS_APP_ADDRESS}/newsletter/${
    token._id
  }" class="es-button" target="_blank"
                                                style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:16px;border-style:solid;border-color:#4f46e5;border-width:15px 25px 15px 25px;display:inline-block;background:#4f46e5;border-radius:28px;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center">Verify
                                                Your Email</a></span></td>
                                    </tr>

                                     ${tableRow(
                                       "If that doesn't work, copy and paste the following link in your browser:"
                                     )}

                                      <tr style="border-collapse:collapse">
                                       <td align="center"
                                          style="Margin:0;padding-top:10px;padding-bottom:15px;padding-left:20px;padding-right:20px">
                                          <p
                                             style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#999999;font-size:16px">
                                             <a target="_blank" href="${NEXT_JS_APP_ADDRESS}/newsletter/${
    token._id
  }" style="color: #4f46e5;">${NEXT_JS_APP_ADDRESS}/newsletter/${token._id}</a>
                                          </p>
                                       </td>
                                    </tr>

                                     ${tableRowAlwaysHappy()}
                                      ${tableRowCheers()}
                                 </table>
                              </td>
                           </tr>
                        </table>
                     </td>
                  </tr>
               </table>
            </td>
         </tr>
      </table>
  ${emailFooter(email)}
  `;
}
