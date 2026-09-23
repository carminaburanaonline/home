<?xml version="1.0" encoding="UTF-8" ?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:param name="id" />

  <xsl:template match="body">
    <div>
      <xsl:apply-templates select=".//*[@xml:id=$id]" />
    </div>
  </xsl:template>

  <xsl:template match="lg[@type='refrain']/head" />

  <xsl:template match="stage">
    <p class="stage"><span class="stage-number" style="color: gray"><xsl:value-of select="@n" /></span><xsl:apply-templates /></p>
  </xsl:template>

  <xsl:template match="p">
    <div class="paragraph"><xsl:apply-templates /></div>
  </xsl:template>

  <xsl:template match="lg[@type='strophe']">
    <div class="strophe" data-type="strophe">
      <xsl:choose>
        <xsl:when test="./@n">
          <xsl:apply-templates>
            <xsl:with-param name="lgHead"><xsl:value-of select="@n"/></xsl:with-param>
          </xsl:apply-templates>
        </xsl:when>
        <xsl:otherwise>
          <xsl:apply-templates>
            <xsl:with-param name="lgHead" />
          </xsl:apply-templates>
        </xsl:otherwise>
      </xsl:choose>
    </div>
  </xsl:template>

  <xsl:template match="lg[@type='refrain']">
    <div class="refrain" data-type="strophe">
      <xsl:apply-templates>
        <xsl:with-param name="lgHead"><xsl:value-of select="./head"/></xsl:with-param>
      </xsl:apply-templates>
    </div>
  </xsl:template>

  <xsl:template match="lg[@type='versicle']">
    <div class="strophe" data-type="strophe">
      <xsl:apply-templates>
        <xsl:with-param name="lgHead"><xsl:value-of select="@n"/></xsl:with-param>
      </xsl:apply-templates>
    </div>
  </xsl:template>

  <xsl:template match="l">
    <xsl:param name="lgHead" />
    <xsl:choose>
      <xsl:when test="@n=1">
        <!-- Create extra div to avoid breaks between strophe/refrain heading and first verse -->
        <div class="no-break non-selectable">
          <div class="lg-heading selectable"><xsl:value-of select="$lgHead"/></div>
          <xsl:call-template name="verse-content" />
        </div>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="verse-content" />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="verse-content">
    <div class="verse">
      <div class="verse-text selectable">
        <xsl:apply-templates/>
      </div>
    </div>
  </xsl:template>

  <xsl:template match="seg[@type='hemistich']">
  <div class="hemistich">
    <xsl:apply-templates/>
  </div>
  </xsl:template>

  <xsl:template match="w">
    <span class="word editorial" style="vertical-align: bottom;">
      <xsl:if test="@rend='italic'">
          <xsl:attribute name="data-rend">italic</xsl:attribute>
      </xsl:if>
      <xsl:apply-templates/>
    </span>
  </xsl:template>

  <xsl:template match="seg[@type='syll']">
    <xsl:variable name="text"><xsl:value-of select="./text()"/></xsl:variable>
    <span class="neumed-syll">
      <span class="syl text-font">
        <xsl:if test="@part='I' or  @part='M'">
          <xsl:attribute name="data-dash">dashed</xsl:attribute>
        </xsl:if>
        <xsl:choose>
          <xsl:when test="@met='+'">
            <span class="syl-text stressed-syl">
              <xsl:value-of select="normalize-space($text)"/>
            </span>
          </xsl:when>
          <xsl:otherwise>
            <span class="syl-text">
              <xsl:value-of select="normalize-space($text)"/>
            </span>
          </xsl:otherwise>
        </xsl:choose>
      </span>
      <xsl:if test="./notatedMusic">
        <span class="neumes non-selectable">
          <xsl:for-each select="notatedMusic/neume">
            <img class="neume">
              <xsl:attribute name="src">neumes/svg/<xsl:value-of select="@fontname"/><xsl:value-of select="@glyph.num"/>.svg</xsl:attribute>
            </img>
          </xsl:for-each>
        </span>
      </xsl:if>
    </span>
  </xsl:template>

 <xsl:template match="pc">
    <span style="flex-shrink: 0;">
      <xsl:choose>
        <xsl:when test="@pre='true'">
          <xsl:attribute name="class">pc pre</xsl:attribute>
        </xsl:when>
        <xsl:otherwise>
          <xsl:attribute name="class">pc</xsl:attribute>
        </xsl:otherwise>
      </xsl:choose>
      <xsl:if test="@rend='space-before'">
        <xsl:attribute name="style">margin-left: 6px;</xsl:attribute>
      </xsl:if>
      <xsl:if test="@rend='space-after'">
        <xsl:attribute name="style">margin-right: 0px;</xsl:attribute>
      </xsl:if>
      <xsl:choose>
        <xsl:when test="@resp='#editor'">
          <xsl:attribute name="data-resp">ed</xsl:attribute>
        </xsl:when>
        <xsl:otherwise>
          <xsl:attribute name="data-resp">ms</xsl:attribute>
        </xsl:otherwise>
      </xsl:choose>
      <xsl:value-of select="./text()"/>
    </span>
  </xsl:template>

  <xsl:template match="app">
    <xsl:apply-templates select="./lem/*" />
  </xsl:template>

</xsl:stylesheet>