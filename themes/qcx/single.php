<?php

/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package qcx
 */

get_header();
?>


<?php
/**
 * Single Post – 1:1 layout
 * BG: #F7F9FB
 * Wrapper: max 1440, px 64, py 80, flex-col, gap 80
 * Left: back/date, title/author, share row
 * Right: featured image (aspect 616/475.84, max-h 475.836, r-8)
 */

get_header();
?>

<section class="bg-[#F7F9FB]">
  <?php while ( have_posts() ) : the_post(); ?>

    <?php
      // helpers
      $blog_url = get_post_type_archive_link('post') ?: home_url('/');
      $date_str = strtoupper( get_the_date('d M Y') ); // e.g. 11 JAN 2022
      $thumb    = has_post_thumbnail() ? wp_get_attachment_image_src( get_post_thumbnail_id(), 'full' ) : null;
      $thumb_url = $thumb ? $thumb[0] : '';
      $perma    = get_permalink();
      $title    = get_the_title();
    ?>

    <!-- Outer wrapper -->
    <section class="mx-auto max-w-[90rem] px-[1rem] md:px-[4rem] py-[5rem]  flex flex-col items-center gap-[5rem]">
      <!-- 50/50 -->
    <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-[5rem] items-stretch">

        <!-- LEFT -->
        <div class="flex flex-col max-w-[82rem] items-start gap-[5rem] h-full">

          <!-- Back + Date (stretch) + Title/Author -->
          <div class="flex flex-col items-start gap-[3rem] self-stretch">

            <!-- Back/date row -->
            <div class="flex justify-between items-start self-stretch">
              <!-- back to blog -->
              <a href="<?php echo esc_url($blog_url); ?>" class="flex items-center gap-2 group">
                <span aria-hidden="true">
                  <!-- 7x12 blue caret -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none" class="translate-x-0 group-hover:-translate-x-0.5 transition">
                    <path d="M5.70715 10.7071L0.707154 5.70711L5.70715 0.707107" stroke="#206EEC" stroke-linecap="square"/>
                  </svg>
                </span>
                <p class="sm text-[#206EEC] leading-[1.3] font-[400] ">Back to blog</p>
              </a>

              <!-- date -->
              <p class="eyebrow text-[0.8rem] leading-[1.2] tracking-[0.1rem] uppercase font-[400] font-a-mono ">
                <?php echo esc_html($date_str); ?>
              </p>
            </div>

            <!-- Title + Author -->
            <div class="flex flex-col items-start gap-[1.5rem]">
              <h3 class="font-[350] leading-[1] tracking-[-0.12rem] text-[4rem] md:text-[4rem] text-[#000]">
                <?php echo esc_html($title); ?>
              </h3>

              <p class="text-[#000] leading-[1.4] font-[400]">
                By
                <span class="text-[#206EEC]"><?php the_author(); ?></span>
              </p>
            </div>

          </div><!-- /back+title wrapper -->

          <!-- Share this post -->
          <div class="flex flex-col items-start gap-1">
            <p class="text-[#000] leading-[1.4] font-[400]">Share this post</p>

            <div class="flex items-center gap-2">
              <!-- LinkedIn -->
              <a href="https://www.linkedin.com/sharing/share-offsite/?url=<?php echo rawurlencode($perma); ?>" target="_blank" rel="noopener" aria-label="Share on LinkedIn" class="shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M27.375 4.5H8.625C6.351 4.5 4.5 6.351 4.5 8.625V27.375C4.5 29.649 6.351 31.5 8.625 31.5H27.375C29.649 31.5 31.5 29.649 31.5 27.375V8.625C31.5 6.351 29.649 4.5 27.375 4.5ZM13.5 25.5C13.5 25.9147 13.1648 26.25 12.75 26.25H10.5C10.0852 26.25 9.75 25.9147 9.75 25.5V15.75C9.75 15.3352 10.0852 15 10.5 15H12.75C13.1648 15 13.5 15.3352 13.5 15.75V25.5ZM11.625 13.5C10.5893 13.5 9.75 12.6608 9.75 11.625C9.75 10.5893 10.5893 9.75 11.625 9.75C12.6608 9.75 13.5 10.5893 13.5 11.625C13.5 12.6608 12.6608 13.5 11.625 13.5ZM26.25 25.5C26.25 25.9147 25.9147 26.25 25.5 26.25H23.25C22.8353 26.25 22.5 25.9147 22.5 25.5V19.875C22.5 18.8407 21.6593 18 20.625 18C19.5907 18 18.75 18.8407 18.75 19.875V25.5C18.75 25.9147 18.4148 26.25 18 26.25H15.75C15.3352 26.25 15 25.9147 15 25.5V15.75C15 15.3352 15.3352 15 15.75 15H18C18.4148 15 18.75 15.3352 18.75 15.75V16.1558C19.5472 15.4395 20.5965 15 21.75 15C24.2318 15 26.25 17.0182 26.25 19.5V25.5Z" fill="#206EEC"/>
                </svg>
              </a>

              <!-- Facebook -->
              <a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo rawurlencode($perma); ?>" target="_blank" rel="noopener" aria-label="Share on Facebook" class="shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M27.375 4.5C29.649 4.5 31.5 6.351 31.5 8.625V27.375C31.5 29.649 29.649 31.5 27.375 31.5H8.625C6.351 31.5 4.5 29.649 4.5 27.375V8.625C4.5 6.351 6.351 4.5 8.625 4.5H27.375ZM19.9814 9C17.1303 9.0001 15.5596 10.5575 15.5596 13.3838V15.2686H13.5156C13.2086 15.2686 12.9204 15.3789 12.7051 15.5791C12.4889 15.7789 12.3723 16.0443 12.375 16.3262L12.3887 17.584C12.3941 18.1563 12.9056 18.622 13.5293 18.6221L15.5596 18.6201V25.9521C15.5596 26.5298 16.0716 26.9998 16.7002 27H18.5254C19.1541 27 19.666 26.5299 19.666 25.9521V18.6201H21.5352C22.1137 18.6201 22.6013 18.2226 22.668 17.6943L22.8271 16.4375C22.865 16.1409 22.7621 15.843 22.5459 15.6201C22.3297 15.3973 22.0196 15.2686 21.6943 15.2686H19.6689L19.6943 13.4648C19.6943 12.9545 20.1469 12.5391 20.7021 12.5391H22.0293C22.4955 12.5389 22.875 12.1908 22.875 11.7627V9.84766C22.8748 9.44269 22.5437 9.11028 22.1035 9.07422C22.0944 9.07338 21.1094 9 19.9814 9Z" fill="#206EEC"/>
                </svg>
              </a>

                <a href="https://www.youtube.com/channel/UChtNTCFKqWimVSPPMUqTSwA" target="_blank" rel="noopener" aria-label="Visit our YouTube Channel">
                    <!-- YouTube SVG -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <path d="M27.375 4.5C29.649 4.5 31.5 6.351 31.5 8.625V27.375C31.5 29.649 29.649 31.5 27.375 31.5H8.625C6.351 31.5 4.5 29.649 4.5 27.375V8.625C4.5 6.351 6.351 4.5 8.625 4.5H27.375ZM18.3145 12C15.6734 12 13.1922 12.2058 11.8711 12.4941C10.9906 12.7003 10.2297 13.3188 10.0693 14.2666C9.90988 15.2558 9.75 16.5201 9.75 18.375C9.75 20.2299 9.9105 21.4528 10.1104 22.4834C10.2708 23.3902 11.0307 24.0501 11.9111 24.2559C13.3117 24.5443 15.7133 24.75 18.3545 24.75C20.9958 24.75 23.3978 24.5443 24.7988 24.2559C25.6793 24.0497 26.4392 23.4311 26.5996 22.4834C26.7599 21.4529 26.96 20.1887 27 18.334C27 16.4793 26.7994 15.2151 26.5996 14.1846C26.4393 13.2776 25.6794 12.6179 24.7988 12.4121C23.3982 12.2064 20.9562 12 18.3145 12ZM15.8662 16.0176C15.8665 15.2973 16.6199 14.846 17.2256 15.2031L20.8457 17.3408C21.4562 17.7013 21.4562 18.6102 20.8457 18.9707L17.2256 21.1084C16.6203 21.465 15.8663 21.0133 15.8662 20.293V16.0176Z" fill="#206EEC"/>
                    </svg>
                </a>

              <!-- X -->
              <a href="https://twitter.com/intent/tweet?url=<?php echo rawurlencode($perma); ?>&text=<?php echo rawurlencode($title); ?>" target="_blank" rel="noopener" aria-label="Share on X" class="shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M12.7013 11.772L21.4403 24.228H23.3633L14.6243 11.772H12.7013Z" fill="#206EEC"/>
                  <path d="M26.625 4.5H9.375C6.687 4.5 4.5 6.687 4.5 9.375V26.625C4.5 29.313 6.687 31.5 9.375 31.5H26.625C29.313 31.5 31.5 29.313 31.5 26.625V9.375C31.5 6.687 29.313 4.5 26.625 4.5ZM20.8657 25.5L16.8525 19.7633L11.8995 25.5H10.3672L16.173 18.7927L10.3718 10.5H15.1995L18.843 15.708L23.352 10.5H24.852L19.5187 16.6755L25.6927 25.5H20.8657Z" fill="#206EEC"/>
                </svg>
              </a>

              <!-- Copy link (Share icon) -->
              <button type="button" id="copyLink" class="shrink-0" aria-label="Copy link">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26.625 4.5H9.375C6.687 4.5 4.5 6.687 4.5 9.375V26.625C4.5 29.313 6.687 31.5 9.375 31.5H26.625C29.313 31.5 31.5 29.313 31.5 26.625V9.375C31.5 6.687 29.313 4.5 26.625 4.5Z" fill="#206EEC"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M25.4999 14.5475V14.8309C25.5006 15.7193 25.1467 16.5712 24.5166 17.1975L22.1666 19.5558C21.7282 19.99 21.0218 19.99 20.5833 19.5558L20.5 19.4641C20.3412 19.3021 20.3412 19.0428 20.5 18.8808L23.3666 16.0142C23.6725 15.6969 23.8403 15.2715 23.8333 14.8309V14.5475C23.8336 14.1033 23.6567 13.6774 23.3416 13.3642L22.7999 12.8225C22.4867 12.5075 22.0608 12.3305 21.6166 12.3309H21.3333C20.8891 12.3305 20.4632 12.5075 20.15 12.8225L17.2833 15.6642C17.1213 15.823 16.862 15.823 16.7 15.6642L16.6083 15.5725C16.1741 15.1341 16.1741 14.4276 16.6083 13.9892L18.9667 11.6226C19.5971 11.0017 20.4485 10.6569 21.3333 10.6642H21.6166C22.5009 10.6635 23.3493 11.0143 23.9749 11.6392L24.5249 12.1892C25.1498 12.8149 25.5006 13.6632 25.4999 14.5475ZM15.2083 19.7808L19.6166 15.3725C19.6948 15.2936 19.8013 15.2493 19.9124 15.2493C20.0235 15.2493 20.13 15.2936 20.2083 15.3725L20.7916 15.9558C20.8704 16.0341 20.9148 16.1406 20.9148 16.2517C20.9148 16.3628 20.8704 16.4693 20.7916 16.5475L16.3833 20.9558C16.305 21.0347 16.1985 21.079 16.0874 21.079C15.9763 21.079 15.8698 21.0347 15.7916 20.9558L15.2083 20.3725C15.1294 20.2942 15.085 20.1877 15.085 20.0766C15.085 19.9655 15.1294 19.859 15.2083 19.7808ZM19.2999 20.6641C19.1379 20.5053 18.8786 20.5053 18.7166 20.6641L15.8583 23.5058C15.5431 23.8229 15.1137 24 14.6666 23.9974H14.3833C13.9391 23.9978 13.5131 23.8208 13.2 23.5058L12.6583 22.9641C12.3433 22.651 12.1663 22.225 12.1667 21.7808V21.4975C12.1663 21.0532 12.3433 20.6273 12.6583 20.3141L15.5083 17.4475C15.6671 17.2855 15.6671 17.0262 15.5083 16.8641L15.4166 16.7725C14.9782 16.3382 14.2717 16.3382 13.8333 16.7725L11.4833 19.1308C10.8533 19.7571 10.4993 20.609 10.5 21.4975V21.7891C10.5015 22.6705 10.8521 23.5155 11.475 24.139L12.025 24.689C12.6506 25.314 13.499 25.6648 14.3833 25.664H14.6666C15.5445 25.6692 16.3889 25.3278 17.0166 24.714L19.3916 22.3391C19.8258 21.9006 19.8258 21.1942 19.3916 20.7558L19.2999 20.6641Z" fill="white"/>
                </svg>
              </button>
            </div>
          </div>

      
        </div>

        <!-- RIGHT (Featured image) -->
        <div class="w-full h-full">
        <figure class="w-full h-full rounded-[8px] overflow-hidden border border-black/0">
            <img src="<?php echo esc_url($thumb_url); ?>"
                alt="<?php echo esc_attr($title); ?>"
                class="w-full h-full object-cover block" />
        </figure>
        </div>
      </div><!-- /50/50 -->
    </section>

    <script>
      (function(){
        var btn = document.getElementById('copyLink');
        if(!btn) return;
        btn.addEventListener('click', function(){
          navigator.clipboard.writeText('<?php echo esc_js($perma); ?>')
            .then(function(){
              btn.setAttribute('aria-label','Copied!');
            });
        }, {passive:true});
      })();
    </script>

  <?php endwhile; ?>
</section>



<!-- content -->

<?php
  // ensure these exist for the share links below
  $perma = get_permalink();
  $title = get_the_title();
?>

<section>
  <!-- main wrapper -->
  <div class="mx-auto max-w-[90rem] px-[1rem] md:px-[4rem]  md:py-[3.5rem]  flex flex-col items-center gap-[5rem]">
    <!-- inner wrapper -->
    <div class="flex flex-col items-center gap-[4rem] w-full">

      <!-- content wrapper -->
      <div class="flex flex-col items-start gap-[2rem] w-full">
        <?php the_content(); ?>
      </div>

      <!-- social wrapper -->
      <div class="flex flex-col items-start gap-1 w-full">
        <p class="text-[#000] leading-[1.4] font-[400]">Share this post</p>

        <div class="flex items-center gap-2">
          <!-- LinkedIn -->
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=<?php echo rawurlencode($perma); ?>" target="_blank" rel="noopener" aria-label="Share on LinkedIn" class="shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M27.375 4.5H8.625C6.351 4.5 4.5 6.351 4.5 8.625V27.375C4.5 29.649 6.351 31.5 8.625 31.5H27.375C29.649 31.5 31.5 29.649 31.5 27.375V8.625C31.5 6.351 29.649 4.5 27.375 4.5ZM13.5 25.5C13.5 25.9147 13.1648 26.25 12.75 26.25H10.5C10.0852 26.25 9.75 25.9147 9.75 25.5V15.75C9.75 15.3352 10.0852 15 10.5 15H12.75C13.1648 15 13.5 15.3352 13.5 15.75V25.5ZM11.625 13.5C10.5893 13.5 9.75 12.6608 9.75 11.625C9.75 10.5893 10.5893 9.75 11.625 9.75C12.6608 9.75 13.5 10.5893 13.5 11.625C13.5 12.6608 12.6608 13.5 11.625 13.5ZM26.25 25.5C26.25 25.9147 25.9147 26.25 25.5 26.25H23.25C22.8353 26.25 22.5 25.9147 22.5 25.5V19.875C22.5 18.8407 21.6593 18 20.625 18C19.5907 18 18.75 18.8407 18.75 19.875V25.5C18.75 25.9147 18.4148 26.25 18 26.25H15.75C15.3352 26.25 15 25.9147 15 25.5V15.75C15 15.3352 15.3352 15 15.75 15H18C18.4148 15 18.75 15.3352 18.75 15.75V16.1558C19.5472 15.4395 20.5965 15 21.75 15C24.2318 15 26.25 17.0182 26.25 19.5V25.5Z" fill="#206EEC"/>
            </svg>
          </a>

          <!-- Facebook -->
          <a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo rawurlencode($perma); ?>" target="_blank" rel="noopener" aria-label="Share on Facebook" class="shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M27.375 4.5C29.649 4.5 31.5 6.351 31.5 8.625V27.375C31.5 29.649 29.649 31.5 27.375 31.5H8.625C6.351 31.5 4.5 29.649 4.5 27.375V8.625C4.5 6.351 6.351 4.5 8.625 4.5H27.375ZM19.9814 9C17.1303 9.0001 15.5596 10.5575 15.5596 13.3838V15.2686H13.5156C13.2086 15.2686 12.9204 15.3789 12.7051 15.5791C12.4889 15.7789 12.3723 16.0443 12.375 16.3262L12.3887 17.584C12.3941 18.1563 12.9056 18.622 13.5293 18.6221L15.5596 18.6201V25.9521C15.5596 26.5298 16.0716 26.9998 16.7002 27H18.5254C19.1541 27 19.666 26.5299 19.666 25.9521V18.6201H21.5352C22.1137 18.6201 22.6013 18.2226 22.668 17.6943L22.8271 16.4375C22.865 16.1409 22.7621 15.843 22.5459 15.6201C22.3297 15.3973 22.0196 15.2686 21.6943 15.2686H19.6689L19.6943 13.4648C19.6943 12.9545 20.1469 12.5391 20.7021 12.5391H22.0293C22.4955 12.5389 22.875 12.1908 22.875 11.7627V9.84766C22.8748 9.44269 22.5437 9.11028 22.1035 9.07422C22.0944 9.07338 21.1094 9 19.9814 9Z" fill="#206EEC"/>
            </svg>
          </a>

          <!-- YouTube (channel follow) -->
          <a href="https://www.youtube.com/channel/UChtNTCFKqWimVSPPMUqTSwA" target="_blank" rel="noopener" aria-label="Visit our YouTube Channel" title="Follow us on YouTube" class="shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M27.375 4.5C29.649 4.5 31.5 6.351 31.5 8.625V27.375C31.5 29.649 29.649 31.5 27.375 31.5H8.625C6.351 31.5 4.5 29.649 4.5 27.375V8.625C4.5 6.351 6.351 4.5 8.625 4.5H27.375ZM18.3145 12C15.6734 12 13.1922 12.2058 11.8711 12.4941C10.9906 12.7003 10.2297 13.3188 10.0693 14.2666C9.90988 15.2558 9.75 16.5201 9.75 18.375C9.75 20.2299 9.9105 21.4528 10.1104 22.4834C10.2708 23.3902 11.0307 24.0501 11.9111 24.2559C13.3117 24.5443 15.7133 24.75 18.3545 24.75C20.9958 24.75 23.3978 24.5443 24.7988 24.2559C25.6793 24.0497 26.4392 23.4311 26.5996 22.4834C26.7599 21.4529 26.96 20.1887 27 18.334C27 16.4793 26.7994 15.2151 26.5996 14.1846C26.4393 13.2776 25.6794 12.6179 24.7988 12.4121C23.3982 12.2064 20.9562 12 18.3145 12ZM15.8662 16.0176C15.8665 15.2973 16.6199 14.846 17.2256 15.2031L20.8457 17.3408C21.4562 17.7013 21.4562 18.6102 20.8457 18.9707L17.2256 21.1084C16.6203 21.465 15.8663 21.0133 15.8662 20.293V16.0176Z" fill="#206EEC"/>
            </svg>
          </a>

          <!-- X -->
          <a href="https://twitter.com/intent/tweet?url=<?php echo rawurlencode($perma); ?>&text=<?php echo rawurlencode($title); ?>" target="_blank" rel="noopener" aria-label="Share on X" class="shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M12.7013 11.772L21.4403 24.228H23.3633L14.6243 11.772H12.7013Z" fill="#206EEC"/>
              <path d="M26.625 4.5H9.375C6.687 4.5 4.5 6.687 4.5 9.375V26.625C4.5 29.313 6.687 31.5 9.375 31.5H26.625C29.313 31.5 31.5 29.313 31.5 26.625V9.375C31.5 6.687 29.313 4.5 26.625 4.5ZM20.8657 25.5L16.8525 19.7633L11.8995 25.5H10.3672L16.173 18.7927L10.3718 10.5H15.1995L18.843 15.708L23.352 10.5H24.852L19.5187 16.6755L25.6927 25.5H20.8657Z" fill="#206EEC"/>
            </svg>
          </a>

          <!-- Copy link -->
      <button type="button" id="copyLink" class="shrink-0" aria-label="Copy link">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26.625 4.5H9.375C6.687 4.5 4.5 6.687 4.5 9.375V26.625C4.5 29.313 6.687 31.5 9.375 31.5H26.625C29.313 31.5 31.5 29.313 31.5 26.625V9.375C31.5 6.687 29.313 4.5 26.625 4.5Z" fill="#206EEC"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M25.4999 14.5475V14.8309C25.5006 15.7193 25.1467 16.5712 24.5166 17.1975L22.1666 19.5558C21.7282 19.99 21.0218 19.99 20.5833 19.5558L20.5 19.4641C20.3412 19.3021 20.3412 19.0428 20.5 18.8808L23.3666 16.0142C23.6725 15.6969 23.8403 15.2715 23.8333 14.8309V14.5475C23.8336 14.1033 23.6567 13.6774 23.3416 13.3642L22.7999 12.8225C22.4867 12.5075 22.0608 12.3305 21.6166 12.3309H21.3333C20.8891 12.3305 20.4632 12.5075 20.15 12.8225L17.2833 15.6642C17.1213 15.823 16.862 15.823 16.7 15.6642L16.6083 15.5725C16.1741 15.1341 16.1741 14.4276 16.6083 13.9892L18.9667 11.6226C19.5971 11.0017 20.4485 10.6569 21.3333 10.6642H21.6166C22.5009 10.6635 23.3493 11.0143 23.9749 11.6392L24.5249 12.1892C25.1498 12.8149 25.5006 13.6632 25.4999 14.5475ZM15.2083 19.7808L19.6166 15.3725C19.6948 15.2936 19.8013 15.2493 19.9124 15.2493C20.0235 15.2493 20.13 15.2936 20.2083 15.3725L20.7916 15.9558C20.8704 16.0341 20.9148 16.1406 20.9148 16.2517C20.9148 16.3628 20.8704 16.4693 20.7916 16.5475L16.3833 20.9558C16.305 21.0347 16.1985 21.079 16.0874 21.079C15.9763 21.079 15.8698 21.0347 15.7916 20.9558L15.2083 20.3725C15.1294 20.2942 15.085 20.1877 15.085 20.0766C15.085 19.9655 15.1294 19.859 15.2083 19.7808ZM19.2999 20.6641C19.1379 20.5053 18.8786 20.5053 18.7166 20.6641L15.8583 23.5058C15.5431 23.8229 15.1137 24 14.6666 23.9974H14.3833C13.9391 23.9978 13.5131 23.8208 13.2 23.5058L12.6583 22.9641C12.3433 22.651 12.1663 22.225 12.1667 21.7808V21.4975C12.1663 21.0532 12.3433 20.6273 12.6583 20.3141L15.5083 17.4475C15.6671 17.2855 15.6671 17.0262 15.5083 16.8641L15.4166 16.7725C14.9782 16.3382 14.2717 16.3382 13.8333 16.7725L11.4833 19.1308C10.8533 19.7571 10.4993 20.609 10.5 21.4975V21.7891C10.5015 22.6705 10.8521 23.5155 11.475 24.139L12.025 24.689C12.6506 25.314 13.499 25.6648 14.3833 25.664H14.6666C15.5445 25.6692 16.3889 25.3278 17.0166 24.714L19.3916 22.3391C19.8258 21.9006 19.8258 21.1942 19.3916 20.7558L19.2999 20.6641Z" fill="white"/>
                </svg>
        </button>
        </div>
      </div>

    </div>
  </div>
</section>


<?php Timber::render('components/newsletter.twig'); ?>
<?php get_template_part('components/related-insights'); ?>
<?php get_template_part('components/content-cta'); ?>



</script>




<?php get_footer(); ?>