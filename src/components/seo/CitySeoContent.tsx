import Link from 'next/link';
import { CITIES, type CityInfo } from '@/lib/cities';

/**
 * Footer SEO block for a city page. Targets: هواشناسی [شهر]، گزارش آب و هوای [شهر].
 * Same pattern as the homepage: visible city directory + expandable prose
 * (<details> is indexed at full weight; display:none would risk a penalty).
 */
export function CitySeoContent({ city }: { city: CityInfo }) {
  const others = CITIES.filter((c) => c.slug !== city.slug).slice(0, 20);

  return (
    <footer
      aria-label={`هواشناسی ${city.nameFa}`}
      className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-12 w-full"
    >
      <div className="border-t border-white/10 pt-6 mt-6">
        <nav aria-label="هواشناسی شهرهای دیگر">
          <h2 className="text-sm sm:text-base font-semibold text-white mb-3">
            هواشناسی شهرهای دیگر
          </h2>
          <ul className="flex flex-wrap gap-2">
            {others.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/weather/${c.slug}`}
                  className="inline-block text-xs sm:text-sm px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-200 hover:bg-white/15 hover:text-white transition-colors"
                >
                  هواشناسی {c.nameFa}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/"
                className="inline-block text-xs sm:text-sm px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
              >
                هواشناسی همه شهرها
              </Link>
            </li>
          </ul>
        </nav>
        <details className="group mt-6">
          <summary className="cursor-pointer text-sm font-medium text-slate-300 hover:text-white transition-colors list-none flex items-center gap-2 [&::-webkit-details-marker]:hidden">
            <span className="transition-transform group-open:rotate-90">▸</span>
            درباره هواشناسی {city.nameFa}
          </summary>
          <div className="mt-3">
            <h3 className="text-sm sm:text-base font-bold text-white mb-2">
              گزارش آب و هوای {city.nameFa} | هواشناسی {city.nameFa} امروز و فردا
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-7">
              <strong className="text-slate-200">هواشناسی {city.nameFa}</strong> ({city.provinceFa}):
              در این صفحه <strong className="text-slate-200">گزارش آب و هوای {city.nameFa}</strong> را
              به‌صورت لحظه‌ای مشاهده می‌کنید — دمای فعلی، وضعیت آسمان، سرعت و جهت باد،
              رطوبت، فشار، پوشش ابر و شاخص UV، به‌همراه پیش‌بینی ساعتی ۲۴ ساعته و
              پیش‌بینی ۷ روزه. اگر به‌دنبال «هواشناسی {city.nameFa} امروز» یا
              «هواشناسی {city.nameFa} فردا» هستید، نمودارها و جدول روزانه دقیق‌ترین
              تصویر را از آب و هوای {city.nameFa} ارائه می‌دهد.
            </p>
          </div>
        </details>
      </div>
    </footer>
  );
}
