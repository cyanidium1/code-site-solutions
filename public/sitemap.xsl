<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Sitemap — code-site.art</title>
        <style>
          :root { color-scheme: light; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1a1a1a; background: #fff; margin: 0; padding: 32px 24px; line-height: 1.4;
          }
          .wrap { max-width: 1100px; margin: 0 auto; }
          h1 { font-size: 28px; font-weight: 700; margin: 0 0 4px; }
          .meta { color: #555; font-size: 13px; margin: 0 0 20px; }
          table { width: 100%; border-collapse: collapse; font-size: 14px; }
          thead th {
            text-align: left; background: #f3f4f6; border-bottom: 2px solid #e5e7eb;
            padding: 10px 12px; font-weight: 600; white-space: nowrap;
          }
          tbody td { padding: 9px 12px; border-bottom: 1px solid #eef0f2; vertical-align: top; }
          tbody tr:nth-child(odd) { background: #fafbfc; }
          tbody tr:hover { background: #eef4ff; }
          a { color: #1a56db; text-decoration: none; word-break: break-all; }
          a:hover { text-decoration: underline; }
          td.num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
          td.nowrap { white-space: nowrap; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>Sitemap</h1>
          <xsl:apply-templates/>
        </div>
      </body>
    </html>
  </xsl:template>

  <!-- Sitemap index: list of child sitemaps -->
  <xsl:template match="s:sitemapindex">
    <p class="meta">
      Sitemap index — <xsl:value-of select="count(s:sitemap)"/> sitemaps.
    </p>
    <table>
      <thead>
        <tr><th>URL</th><th>Last Modified</th></tr>
      </thead>
      <tbody>
        <xsl:for-each select="s:sitemap">
          <tr>
            <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
            <td class="nowrap"><xsl:value-of select="s:lastmod"/></td>
          </tr>
        </xsl:for-each>
      </tbody>
    </table>
  </xsl:template>

  <!-- URL set: one row per page -->
  <xsl:template match="s:urlset">
    <p class="meta">
      <xsl:value-of select="count(s:url)"/> URLs.
    </p>
    <table>
      <thead>
        <tr>
          <th>URL</th><th>Last Modified</th><th>Change Freq</th><th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <xsl:for-each select="s:url">
          <tr>
            <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
            <td class="nowrap"><xsl:value-of select="s:lastmod"/></td>
            <td><xsl:value-of select="s:changefreq"/></td>
            <td class="num"><xsl:value-of select="s:priority"/></td>
          </tr>
        </xsl:for-each>
      </tbody>
    </table>
  </xsl:template>
</xsl:stylesheet>
