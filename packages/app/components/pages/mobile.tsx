import { useSession } from "next-auth/react"
import { memo } from "react"
import { FC, HTMLAttributes } from "react"

import { AlertCircle, MessageCircleIcon } from "lucide-react"

import { AuthFrame } from "@/components/app/frames/misc/auth"
import { PageContent } from "@/components/page/content"
import { PageHeader } from "@/components/page/header"
import { PageNavbar } from "@/components/page/navbar"
import { useSocket } from "@/state/authentication"
import { COLUMNS, useColumnData } from "@/state/columns"

import { ColumnAuthenticate } from "../app/columns/utils/column-authenticate"
import Container from "../app/layout/container"
import { Callout } from "../app/utils/callout"
import { ReferralRequired } from "../app/utils/referral-required"
import { Button } from "../shared/buttons/button"

export const ExperiencingIssues: FC<HTMLAttributes<HTMLOrSVGElement>> = ({ ...props }) => {
	return (
		<svg viewBox="0 0 498 498" fill="none" {...props}>
			<mask id="path-1-inside-1_4725_292" fill="white">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M57.0536 101.713C59.6597 91.2688 65.0456 81.376 73.2112 73.2103C81.3767 65.0449 91.2692 59.659 101.713 57.0529C106.933 47.6391 114.696 39.4772 124.697 33.7032C134.698 27.929 145.648 25.2871 156.411 25.4731C163.89 17.7312 173.501 11.8565 184.656 8.86766C195.81 5.87886 207.07 6.16091 217.418 9.12587C226.646 3.58346 237.45 0.396485 248.998 0.396484C260.547 0.396483 271.351 3.58365 280.579 9.12636C290.926 6.16148 302.186 5.87947 313.341 8.86824C324.495 11.8569 334.105 17.731 341.584 25.4721C352.346 25.2863 363.296 27.9282 373.297 33.7022C383.298 39.4762 391.06 47.6379 396.281 57.0516C406.725 59.6576 416.618 65.0435 424.784 73.2093C432.949 81.3748 438.335 91.2673 440.941 101.711C450.355 106.931 458.517 114.694 464.291 124.695C470.065 134.696 472.707 145.646 472.521 156.408C480.263 163.887 486.138 173.498 489.126 184.653C492.115 195.807 491.833 207.068 488.868 217.416C494.411 226.644 497.598 237.448 497.598 248.996C497.598 260.544 494.411 271.348 488.868 280.576C491.833 290.924 492.115 302.184 489.126 313.338C486.137 324.492 480.263 334.103 472.521 341.582C472.707 352.345 470.065 363.295 464.291 373.296C458.517 383.296 450.356 391.059 440.942 396.279C438.336 406.723 432.95 416.616 424.785 424.782C416.619 432.948 406.725 438.334 396.281 440.94C391.06 450.353 383.298 458.515 373.297 464.289C363.296 470.063 352.347 472.705 341.585 472.519C334.106 480.261 324.495 486.136 313.34 489.125C302.186 492.113 290.926 491.831 280.578 488.866C271.35 494.409 260.546 497.596 248.998 497.596C237.449 497.596 226.645 494.408 217.417 488.866C207.069 491.831 195.809 492.113 184.654 489.124C173.5 486.135 163.89 480.261 156.411 472.52C145.648 472.706 134.698 470.064 124.697 464.29C114.696 458.516 106.933 450.354 101.713 440.94C91.2695 438.334 81.3774 432.948 73.2123 424.783C65.0468 416.617 59.661 406.725 57.0549 396.281C47.6402 391.061 39.4776 383.298 33.7031 373.296C27.9287 363.294 25.2868 352.344 25.473 341.581C17.7326 334.102 11.8591 324.492 8.87064 313.339C5.88189 302.185 6.16389 290.925 9.12872 280.577C3.58575 271.349 0.398438 260.545 0.398438 248.996C0.398438 237.448 3.58545 226.644 9.12791 217.416C6.16341 207.069 5.88156 195.809 8.87019 184.656C11.859 173.501 17.7334 163.89 25.4751 156.412C25.2889 145.648 27.9308 134.698 33.7051 124.696C39.4789 114.696 47.6403 106.933 57.0536 101.713Z"
				/>
			</mask>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M57.0536 101.713C59.6597 91.2688 65.0456 81.376 73.2112 73.2103C81.3767 65.0449 91.2692 59.659 101.713 57.0529C106.933 47.6391 114.696 39.4772 124.697 33.7032C134.698 27.929 145.648 25.2871 156.411 25.4731C163.89 17.7312 173.501 11.8565 184.656 8.86766C195.81 5.87886 207.07 6.16091 217.418 9.12587C226.646 3.58346 237.45 0.396485 248.998 0.396484C260.547 0.396483 271.351 3.58365 280.579 9.12636C290.926 6.16148 302.186 5.87947 313.341 8.86824C324.495 11.8569 334.105 17.731 341.584 25.4721C352.346 25.2863 363.296 27.9282 373.297 33.7022C383.298 39.4762 391.06 47.6379 396.281 57.0516C406.725 59.6576 416.618 65.0435 424.784 73.2093C432.949 81.3748 438.335 91.2673 440.941 101.711C450.355 106.931 458.517 114.694 464.291 124.695C470.065 134.696 472.707 145.646 472.521 156.408C480.263 163.887 486.138 173.498 489.126 184.653C492.115 195.807 491.833 207.068 488.868 217.416C494.411 226.644 497.598 237.448 497.598 248.996C497.598 260.544 494.411 271.348 488.868 280.576C491.833 290.924 492.115 302.184 489.126 313.338C486.137 324.492 480.263 334.103 472.521 341.582C472.707 352.345 470.065 363.295 464.291 373.296C458.517 383.296 450.356 391.059 440.942 396.279C438.336 406.723 432.95 416.616 424.785 424.782C416.619 432.948 406.725 438.334 396.281 440.94C391.06 450.353 383.298 458.515 373.297 464.289C363.296 470.063 352.347 472.705 341.585 472.519C334.106 480.261 324.495 486.136 313.34 489.125C302.186 492.113 290.926 491.831 280.578 488.866C271.35 494.409 260.546 497.596 248.998 497.596C237.449 497.596 226.645 494.408 217.417 488.866C207.069 491.831 195.809 492.113 184.654 489.124C173.5 486.135 163.89 480.261 156.411 472.52C145.648 472.706 134.698 470.064 124.697 464.29C114.696 458.516 106.933 450.354 101.713 440.94C91.2695 438.334 81.3774 432.948 73.2123 424.783C65.0468 416.617 59.661 406.725 57.0549 396.281C47.6402 391.061 39.4776 383.298 33.7031 373.296C27.9287 363.294 25.2868 352.344 25.473 341.581C17.7326 334.102 11.8591 324.492 8.87064 313.339C5.88189 302.185 6.16389 290.925 9.12872 280.577C3.58575 271.349 0.398438 260.545 0.398438 248.996C0.398438 237.448 3.58545 226.644 9.12791 217.416C6.16341 207.069 5.88156 195.809 8.87019 184.656C11.859 173.501 17.7334 163.89 25.4751 156.412C25.2889 145.648 27.9308 134.698 33.7051 124.696C39.4789 114.696 47.6403 106.933 57.0536 101.713Z"
				fill="#F38A8A"
			/>
			<path
				d="M57.0536 101.713L76.4532 136.694L91.655 128.263L95.8636 111.397L57.0536 101.713ZM101.713 57.0529L111.398 95.8628L128.264 91.654L136.694 76.4517L101.713 57.0529ZM124.697 33.7032L104.697 -0.937835L104.697 -0.937827L124.697 33.7032ZM156.411 25.4731L155.72 65.4672L173.102 65.7676L185.18 53.2646L156.411 25.4731ZM184.656 8.86766L174.303 -29.7694L174.303 -29.7694L184.656 8.86766ZM217.418 9.12587L206.4 47.5785L223.111 52.3668L238.013 43.4163L217.418 9.12587ZM248.998 0.396484L248.998 40.3965L248.998 40.3965L248.998 0.396484ZM280.579 9.12636L259.983 43.4165L274.885 52.3673L291.596 47.579L280.579 9.12636ZM313.341 8.86824L323.693 -29.7688L323.693 -29.7688L313.341 8.86824ZM341.584 25.4721L312.816 53.2647L324.894 65.7662L342.274 65.4662L341.584 25.4721ZM373.297 33.7022L393.297 -0.938819L393.297 -0.938825L373.297 33.7022ZM396.281 57.0516L361.3 76.4506L369.73 91.6531L386.597 95.8617L396.281 57.0516ZM424.784 73.2093L453.068 44.9251L424.784 73.2093ZM440.941 101.711L402.131 111.396L406.34 128.262L421.542 136.692L440.941 101.711ZM464.291 124.695L498.932 104.695L498.932 104.695L464.291 124.695ZM472.521 156.408L432.527 155.718L432.227 173.099L444.729 185.177L472.521 156.408ZM489.126 184.653L527.764 174.3L527.763 174.3L489.126 184.653ZM488.868 217.416L450.416 206.397L445.627 223.109L454.578 238.011L488.868 217.416ZM488.868 280.576L454.578 259.981L445.627 274.883L450.415 291.594L488.868 280.576ZM489.126 313.338L450.489 302.985L450.489 302.985L489.126 313.338ZM472.521 341.582L444.729 312.813L432.227 324.892L432.527 342.273L472.521 341.582ZM464.291 373.296L498.932 393.296L498.932 393.296L464.291 373.296ZM440.942 396.279L421.543 361.299L406.341 369.729L402.132 386.595L440.942 396.279ZM396.281 440.94L386.598 402.13L369.731 406.338L361.3 421.541L396.281 440.94ZM373.297 464.289L393.297 498.93L393.297 498.93L373.297 464.289ZM341.585 472.519L342.274 432.525L324.894 432.225L312.816 444.728L341.585 472.519ZM313.34 489.125L323.693 527.762L323.693 527.762L313.34 489.125ZM280.578 488.866L291.596 450.414L274.885 445.625L259.983 454.576L280.578 488.866ZM217.417 488.866L238.013 454.576L223.11 445.625L206.399 450.413L217.417 488.866ZM184.654 489.124L195.007 450.487L195.007 450.487L184.654 489.124ZM156.411 472.52L185.179 444.728L173.101 432.226L155.72 432.526L156.411 472.52ZM124.697 464.29L104.697 498.931L104.697 498.931L124.697 464.29ZM101.713 440.94L136.694 421.541L128.264 406.339L111.398 402.13L101.713 440.94ZM73.2123 424.783L44.928 453.067L44.928 453.067L73.2123 424.783ZM57.0549 396.281L95.8647 386.597L91.6557 369.73L76.4523 361.299L57.0549 396.281ZM33.7031 373.296L-0.937943 393.296L-0.937943 393.296L33.7031 373.296ZM25.473 341.581L65.467 342.273L65.7677 324.892L53.2666 312.814L25.473 341.581ZM8.87064 313.339L47.5077 302.986L47.5077 302.986L8.87064 313.339ZM9.12872 280.577L47.5814 291.595L52.3697 274.884L43.4186 259.981L9.12872 280.577ZM9.12791 217.416L43.4183 238.011L52.3685 223.11L47.5809 206.399L9.12791 217.416ZM8.87019 184.656L-29.7668 174.303L-29.7668 174.303L8.87019 184.656ZM25.4751 156.412L53.267 185.18L65.7698 173.101L65.4691 155.72L25.4751 156.412ZM33.7051 124.696L68.3462 144.696L68.3462 144.696L33.7051 124.696ZM44.9269 44.9261C31.489 58.364 22.5572 74.7415 18.2436 92.0286L95.8636 111.397C96.7622 107.796 98.6021 104.388 101.495 101.495L44.9269 44.9261ZM92.0283 18.243C74.7417 22.5567 58.3645 31.4884 44.9269 44.9261L101.495 101.495C104.389 98.6013 107.797 96.7614 111.398 95.8628L92.0283 18.243ZM104.697 -0.937827C88.239 8.56433 75.3726 22.0724 66.7317 37.6541L136.694 76.4517C138.494 73.2059 141.153 70.3902 144.697 68.3442L104.697 -0.937827ZM157.103 -14.5209C139.288 -14.8288 121.156 -10.4402 104.697 -0.937835L144.697 68.3442C148.241 66.2982 152.009 65.403 155.72 65.4672L157.103 -14.5209ZM174.303 -29.7694C155.946 -24.8507 140.022 -15.1329 127.643 -2.31838L185.18 53.2646C187.759 50.5953 191.056 48.5638 195.009 47.5047L174.303 -29.7694ZM228.436 -29.3268C211.309 -34.2344 192.659 -34.6879 174.303 -29.7694L195.009 47.5047C198.961 46.4456 202.832 46.5562 206.4 47.5785L228.436 -29.3268ZM248.998 -39.6035C229.994 -39.6035 212.097 -34.3384 196.823 -25.1646L238.013 43.4163C241.195 41.5053 244.906 40.3965 248.998 40.3965L248.998 -39.6035ZM301.175 -25.1637C285.9 -34.3381 268.003 -39.6035 248.998 -39.6035L248.998 40.3965C253.09 40.3965 256.801 41.5054 259.983 43.4165L301.175 -25.1637ZM323.693 -29.7688C305.337 -34.6873 286.688 -34.2338 269.561 -29.3263L291.596 47.579C295.164 46.5568 299.036 46.4462 302.988 47.5053L323.693 -29.7688ZM370.351 -2.32043C357.972 -15.1336 342.049 -24.8504 323.693 -29.7688L302.988 47.5053C306.94 48.5643 310.237 50.5956 312.816 53.2647L370.351 -2.32043ZM393.297 -0.938825C376.839 -10.4409 358.708 -14.8295 340.893 -14.5219L342.274 65.4662C345.985 65.4021 349.753 66.2973 353.297 68.3432L393.297 -0.938825ZM431.262 37.6526C422.621 22.0711 409.755 8.56324 393.297 -0.938819L353.297 68.3432C356.841 70.3892 359.5 73.2048 361.3 76.4506L431.262 37.6526ZM453.068 44.9251C439.63 31.4869 423.252 22.555 405.965 18.2415L386.597 95.8617C390.198 96.7602 393.606 98.6001 396.5 101.494L453.068 44.9251ZM479.751 92.0264C475.437 74.7398 466.506 58.3626 453.068 44.9251L396.5 101.494C399.393 104.387 401.233 107.795 402.131 111.396L479.751 92.0264ZM498.932 104.695C489.43 88.2371 475.922 75.3707 460.34 66.7298L421.542 136.692C424.788 138.492 427.604 141.152 429.65 144.695L498.932 104.695ZM512.515 157.099C512.823 139.284 508.434 121.153 498.932 104.695L429.65 144.695C431.696 148.239 432.591 152.007 432.527 155.718L512.515 157.099ZM527.763 174.3C522.845 155.943 513.127 140.019 500.313 127.64L444.729 185.177C447.399 187.756 449.43 191.053 450.489 195.006L527.763 174.3ZM527.321 228.434C532.228 211.306 532.682 192.657 527.764 174.3L450.489 195.006C451.548 198.958 451.438 202.83 450.416 206.397L527.321 228.434ZM537.598 248.996C537.598 229.991 532.332 212.095 523.158 196.82L454.578 238.011C456.489 241.193 457.598 244.904 457.598 248.996H537.598ZM523.158 301.172C532.332 285.898 537.598 268.001 537.598 248.996H457.598C457.598 253.088 456.489 256.799 454.578 259.981L523.158 301.172ZM527.763 323.69C532.681 305.335 532.228 286.686 527.321 269.559L450.415 291.594C451.437 295.161 451.548 299.033 450.489 302.985L527.763 323.69ZM500.313 370.35C513.127 357.971 522.844 342.047 527.763 323.69L450.489 302.985C449.43 306.937 447.398 310.235 444.729 312.813L500.313 370.35ZM498.932 393.296C508.434 376.837 512.823 358.706 512.515 340.891L432.527 342.273C432.591 345.984 431.696 349.752 429.65 353.296L498.932 393.296ZM460.342 431.26C475.923 422.619 489.43 409.753 498.932 393.296L429.65 353.296C427.604 356.839 424.788 359.499 421.543 361.299L460.342 431.26ZM453.069 453.066C466.507 439.628 475.439 423.251 479.752 405.964L402.132 386.595C401.234 390.196 399.394 393.604 396.501 396.498L453.069 453.066ZM405.964 479.75C423.252 475.437 439.63 466.505 453.069 453.066L396.501 396.498C393.607 399.391 390.199 401.231 386.598 402.13L405.964 479.75ZM393.297 498.93C409.755 489.428 422.621 475.92 431.262 460.339L361.3 421.541C359.5 424.786 356.84 427.602 353.297 429.648L393.297 498.93ZM340.895 512.513C358.709 512.82 376.839 508.432 393.297 498.93L353.297 429.648C349.753 431.694 345.985 432.589 342.274 432.525L340.895 512.513ZM323.693 527.762C342.05 522.843 357.974 513.125 370.353 500.311L312.816 444.728C310.237 447.397 306.94 449.428 302.987 450.487L323.693 527.762ZM269.56 527.319C286.688 532.227 305.337 532.68 323.693 527.762L302.987 450.487C299.035 451.547 295.164 451.436 291.596 450.414L269.56 527.319ZM248.998 537.596C268.002 537.596 285.899 532.331 301.173 523.157L259.983 454.576C256.801 456.487 253.09 457.596 248.998 457.596V537.596ZM196.821 523.156C212.096 532.33 229.993 537.596 248.998 537.596V457.596C244.906 457.596 241.195 456.487 238.013 454.576L196.821 523.156ZM174.302 527.761C192.658 532.68 211.308 532.226 228.435 527.318L206.399 450.413C202.831 451.436 198.96 451.546 195.007 450.487L174.302 527.761ZM127.644 500.313C140.023 513.126 155.946 522.843 174.302 527.761L195.007 450.487C191.055 449.428 187.758 447.397 185.179 444.728L127.644 500.313ZM104.697 498.931C121.156 508.433 139.288 512.822 157.102 512.514L155.72 432.526C152.009 432.59 148.241 431.695 144.697 429.649L104.697 498.931ZM66.7315 460.339C75.3724 475.921 88.2388 489.429 104.697 498.931L144.697 429.649C141.154 427.603 138.494 424.787 136.694 421.541L66.7315 460.339ZM44.928 453.067C58.3651 466.504 74.7416 475.436 92.0274 479.75L111.398 402.13C107.798 401.232 104.39 399.392 101.497 396.499L44.928 453.067ZM18.245 405.966C22.5588 423.253 31.4904 439.63 44.928 453.067L101.497 396.499C98.6032 393.605 96.7633 390.197 95.8647 386.597L18.245 405.966ZM-0.937943 393.296C8.56492 409.755 22.0743 422.622 37.6575 431.263L76.4523 361.299C73.2062 359.499 70.3902 356.84 68.3441 353.296L-0.937943 393.296ZM-14.521 340.889C-14.8292 358.704 -10.4406 376.837 -0.937943 393.296L68.3441 353.296C66.298 349.752 65.4028 345.984 65.467 342.273L-14.521 340.889ZM-29.7664 323.692C-24.8483 342.046 -15.1325 357.969 -2.3205 370.347L53.2666 312.814C50.5977 310.236 48.5666 306.938 47.5077 302.986L-29.7664 323.692ZM-29.324 269.56C-34.2314 286.687 -34.6849 305.336 -29.7664 323.692L47.5077 302.986C46.4486 299.034 46.5592 295.163 47.5814 291.595L-29.324 269.56ZM-39.6016 248.996C-39.6016 268.002 -34.3359 285.899 -25.1611 301.174L43.4186 259.981C41.5074 256.799 40.3984 253.088 40.3984 248.996H-39.6016ZM-25.1624 196.821C-34.3364 212.095 -39.6016 229.992 -39.6016 248.996H40.3984C40.3984 244.904 41.5073 241.193 43.4183 238.011L-25.1624 196.821ZM-29.7668 174.303C-34.6851 192.658 -34.2319 211.306 -29.325 228.433L47.5809 206.399C46.5587 202.832 46.4482 198.96 47.5072 195.008L-29.7668 174.303ZM-2.31677 127.643C-15.1308 140.022 -24.8482 155.946 -29.7668 174.303L47.5072 195.008C48.5663 191.056 50.5977 187.758 53.267 185.18L-2.31677 127.643ZM-0.935874 104.696C-10.4385 121.155 -14.8271 139.288 -14.5189 157.103L65.4691 155.72C65.4049 152.009 66.3001 148.24 68.3462 144.696L-0.935874 104.696ZM37.654 66.732C22.0731 75.3728 8.56585 88.2388 -0.935878 104.696L68.3462 144.696C70.392 141.153 73.2076 138.494 76.4532 136.694L37.654 66.732Z"
				fill="#583838"
				mask="url(#path-1-inside-1_4725_292)"
			/>
			<circle cx="249" cy="302" r="45" fill="#583838" />
			<circle cx="249" cy="302" r="22" fill="#F38A8A" />
			<circle cx="306.449" cy="202.827" r="23.8274" fill="#583838" />
			<circle cx="190.488" cy="202.827" r="23.8274" fill="#583838" />
		</svg>
	)
}

export const MobileConsole = memo(() => {
	// const { data: session } = useSession()
	// const { socket } = useSocket()
	// const { column } = useColumnData(COLUMNS.MOBILE_INDEX)

	// const showNavbar = column?.key !== COLUMNS.KEYS.PLUG

	// const isAuthenticated = session?.user.id?.startsWith("0x")
	// const isReferred = Boolean(socket && socket.identity?.referrerId)

	// const showUI = !isAuthenticated || isReferred

	return (
		<div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center bg-plug-white">
			<ExperiencingIssues className="mb-12 h-48 w-48" />

			<Callout
				className="h-max"
				title="I'm sorry. Plug is not supported on mobile yet."
				description="We tried to crunch, but we did not make it in time. Mobile is limited for now and remains one of the focuses to take us into beta."
			>
				<Button
					onClick={() => {}}
					sizing="md"
					className="flex flex-row items-center gap-2 bg-plug-red text-black/80"
				>
					<MessageCircleIcon className="mr-2 h-4 w-4 opacity-60" />
					Complain to Drake
				</Button>
			</Callout>
		</div>
	)

	// return (
	// 	<>
	// 		{showUI && <PageHeader />}
	// 		{!isAuthenticated ? (
	// 			<Container>
	// 				<ColumnAuthenticate index={COLUMNS.MOBILE_INDEX} />
	// 			</Container>
	// 		) : !isReferred ? (
	// 			<Container>
	// 				<ReferralRequired />
	// 			</Container>
	// 		) : (
	// 			<PageContent />
	// 		)}
	// 		{showUI && showNavbar && <PageNavbar />}

	// 		<AuthFrame />
	// 	</>
	// )
})

MobileConsole.displayName = "MobileConsole"
