import Link from 'next/link';
import { CITIES } from '@/lib/cities';

/**
 * Footer SEO block for the homepage. The city directory stays visible
 * (real navigation for users + internal links for crawlers); the prose
 * lives in a user-expandable <details> so it doesn't clutter the dashboard.
 * Note: <details> content is indexed by Google at full weight, while
 * display:none text would risk a hidden-text penalty — so keep it expandable,
 * never hidden.
 */
export function HomeSeoContent() {
  return (
    <footer
      aria-label="هواشناسی و گزارش آب و هوا"
      className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-12 w-full"
    >
      <div className="border-t border-white/10 pt-6 mt-6">
        <nav aria-label="هواشناسی شهرها">
          <h2 className="text-sm sm:text-base font-semibold text-white mb-3">
            هواشناسی شهرها | گزارش آب و هوای شهر شما
          </h2>
          <ul className="flex flex-wrap gap-2">
            {CITIES.map((city) => (
              <li key={city.slug}>
                <Link
                  href={`/weather/${city.slug}`}
                  className="inline-block text-xs sm:text-sm px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-200 hover:bg-white/15 hover:text-white transition-colors"
                >
                  هواشناسی {city.nameFa}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <details className="group mt-6">
          <summary className="cursor-pointer text-sm font-medium text-slate-300 hover:text-white transition-colors list-none flex items-center gap-2 [&::-webkit-details-marker]:hidden">
            <span className="transition-transform group-open:rotate-90">▸</span>
            درباره هواشناسی و گزارش آب و هوا
          </summary>
          <div className="mt-3">
            <h3 className="text-sm sm:text-base font-bold text-white mb-2">
              هواشناسی | گزارش آب و هوا و پیش‌بینی دقیق
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-7">
              <strong className="text-slate-200">هواشناسی</strong> و{' '}
              <strong className="text-slate-200">گزارش آب و هوا</strong> را به‌صورت دقیق و
              لحظه‌ای دنبال کنید: پیش‌بینی ساعتی و ۷ روزه دما، احتمال بارش، سرعت باد،
              رطوبت، فشار، پوشش ابر و شاخص UV برای تهران و همه شهرهای ایران. کافی است
              شهر موردنظر را جستجو کنید یا از روی نقشه انتخاب کنید تا گزارش کامل آب و
              هوای امروز و فردا را ببینید. به‌دنبال «هواشناسی تهران»، «هواشناسی مشهد»،
              «هواشناسی اصفهان»، «هواشناسی شیراز» یا «گزارش آب و هوای» شهر خود هستید؟
              صفحات اختصاصی هر شهر، پیش‌بینی ساعتی، وضعیت امروز و فردا و تحلیل ۷ روزه
              را ارائه می‌دهد.
            </p>
          </div>
        </details>
      </div>
    </footer>
  );
}
