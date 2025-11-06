
<?php
// ---------------------------------------------
// Related Insights Section (Pure PHP Version)
// ---------------------------------------------

$current_post_id = get_the_ID();
$categories = wp_get_post_terms($current_post_id, 'category', ['fields' => 'ids']);

// Build base query args
$args = [
  'post_type'           => 'post',
  'post_status'         => 'publish',
  'posts_per_page'      => 3,
  'ignore_sticky_posts' => true,
  'post__not_in'        => [$current_post_id],
];

// Add category filter only if the post has categories
if (!empty($categories)) {
  $args['category__in'] = $categories;
}

// Run query
$related_query = new WP_Query($args);
?>

<?php if ($related_query->have_posts()) : ?>
<section class="bg-[#F7F9FB]">
  <div class="mx-auto max-w-[90rem] px-[1rem] md:px-[4rem] py-[2.5rem] md:py-[7.5rem] flex flex-col items-center gap-[4rem]">
    
    <!-- Title -->
    <div class="w-full max-w-[68.125rem] flex items-end gap-8">
      <h2 class="text-[2.25rem] md:text-[4.5rem] leading-[1] font-[350] tracking-[-0.135rem] text-[#000]">
        Related insights
      </h2>
    </div>

    <!-- Grid Wrapper -->
    <div class="w-full flex flex-wrap items-end gap-[1.5rem]">
      <?php while ($related_query->have_posts()) : $related_query->the_post(); ?>
        <article class="group relative flex flex-col gap-[1.5rem] p-[1.25rem] md:p-[2rem] border border-[#D9D9D9] rounded-[0.5rem] bg-[#F7F9FB] overflow-hidden w-full md:w-[calc(33.333%-1rem)]">
          <a href="<?php the_permalink(); ?>" class="absolute inset-0 z-[21]" aria-label="<?php the_title_attribute(); ?>"></a>

          <div class="relative flex flex-col gap-[1.5rem] z-20">
            <div class="flex items-center gap-[0.5rem]">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="10" height="10" rx="2" fill="#08E8BD"/>
              </svg>
              <?php
              $cat = get_the_category();
              $label = (!empty($cat)) ? esc_html($cat[0]->name) : 'BLOG';
              ?>
              <p class="eyebrow uppercase !text-[#000] text-[0.75rem] font-[500] leading-[1.2] tracking-[0.075rem]">
                <?php echo $label; ?>
              </p>
            </div>

            <p class="leading-[1.1] !text-[#000] transition-colors duration-200 group-hover:text-[#08E8BD] font-[400] text-[1.25rem]">
              <?php the_title(); ?>
            </p>
          </div>

          <div class="relative w-full h-[17.2356rem] overflow-hidden rounded-[0.5rem] z-0">
            <?php if (has_post_thumbnail()) : ?>
              <?php the_post_thumbnail('large', ['class' => 'w-full h-full object-cover transition-transform duration-300']); ?>
            <?php endif; ?>
          </div>
        </article>
      <?php endwhile; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php wp_reset_postdata(); ?>