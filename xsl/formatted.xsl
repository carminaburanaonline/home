<?xml version="1.0" encoding="UTF-8" ?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="teiHeader"/>

  <xsl:template match="body">
    <div class="text-font" style="font-size: 16px;">
      <xsl:apply-templates />
    </div>
  </xsl:template>

  <xsl:template match="castList" />

  <xsl:template match="head">
    <b><xsl:apply-templates /></b>
  </xsl:template>

  <xsl:template match="div/head">
    <b><xsl:apply-templates /></b><span class="break"></span>
  </xsl:template>

  <xsl:template match="prologue">
    <p><xsl:apply-templates /></p>
  </xsl:template>

  <!-- TODO: decide how to represent it compared to direct speech -->
  <xsl:template match="q">
    <xsl:apply-templates />
  </xsl:template>

  <xsl:template match="lg[@type='refrain']/head" />

  <xsl:template match="div[@type='drama']">
    <div class="prose-text flex-column">
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <xsl:template match="move | stage">
    <p class="stage flex-wrapper"><span class="stage-number" style="color: gray"><xsl:value-of select="@n" /></span><xsl:apply-templates /></p>
  </xsl:template>

  <xsl:template match="sp">
    <div class="spoken-text">
      <xsl:apply-templates />
    </div>
  </xsl:template>

  <xsl:template match="div[@type='prose']">
    <div class="prose-text flex-column">
      <xsl:apply-templates />
    </div>
  </xsl:template>

  <xsl:template match="p">
    <p class="text-font flex-wrapper"><xsl:apply-templates /></p>
  </xsl:template>

  <xsl:template match="div[@type='sequence']">
    <div class="flex-column" data-type="poem">
      <xsl:apply-templates />
    </div>
  </xsl:template>

  <xsl:template match="div[@type='poem'] | div[@type='leich']">
    <div class="flex-column" data-type="poem">
      <xsl:if test="@met">
        <xsl:attribute name="data-met"><xsl:value-of select="@met" /></xsl:attribute>
      </xsl:if>
      <xsl:if test="@rhyme">
        <xsl:attribute name="data-rhyme"><xsl:value-of select="@rhyme" /></xsl:attribute>
      </xsl:if>
      <xsl:apply-templates />
    </div>
  </xsl:template>

  <xsl:template match="lg[@type='strophe']">
    <div class="flex-column strophe" data-type="strophe">
      <xsl:attribute name="data-met"><xsl:value-of select="@met" /></xsl:attribute>
      <xsl:attribute name="data-rhyme"><xsl:value-of select="@rhyme" /></xsl:attribute>
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
    <div class="flex-column refrain" data-type="strophe">
      <xsl:attribute name="data-met"><xsl:value-of select="@met" /></xsl:attribute>
      <xsl:attribute name="data-rhyme"><xsl:value-of select="@rhyme" /></xsl:attribute>
      <xsl:apply-templates>
        <xsl:with-param name="lgHead"><xsl:value-of select="./head"/></xsl:with-param>
      </xsl:apply-templates>
    </div>
  </xsl:template>

  <xsl:template match="lg[@type='versicle']">
    <div class="flex-column strophe" data-type="strophe">
      <xsl:attribute name="data-met"><xsl:value-of select="@met" /></xsl:attribute>
      <xsl:attribute name="data-rhyme"><xsl:value-of select="@rhyme" /></xsl:attribute>
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
      <div class="verse-number non-selectable">
        <xsl:value-of select="@n"/>
      </div>
      <div class="verse-text selectable">
        <xsl:apply-templates/>
      </div>
      <div class="verse-met non-selectable">
        <xsl:choose>
          <xsl:when test="@met-variant">
            <b><xsl:value-of select="@met-variant"/></b>(<xsl:value-of select="@met"/>)
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="@met"/>
          </xsl:otherwise>
        </xsl:choose>
      </div>
      <div class="verse-rhyme non-selectable">
        <xsl:choose>
          <xsl:when test="@rhyme-variant">
            <b><xsl:value-of select="@rhyme-variant"/></b>(<xsl:value-of select="@rhyme"/>)
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="@rhyme"/>
          </xsl:otherwise>
        </xsl:choose>
      </div>
    </div>
  </xsl:template>

  <xsl:template match="seg[@type='hemistich']">
  <div class="hemistich">
    <xsl:apply-templates/>
  </div>
  </xsl:template>

  <!--<xsl:include href="word-and-syll.xsl"/>-->

  <xsl:template match="w">
    <span class="word text-font" style="vertical-align: bottom;">
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
    <span>
      <xsl:attribute name="class">
        <xsl:if test="@type='text'">apparatus-in-text app-type-text apparatus-active</xsl:if>
        <xsl:if test="@type='neume'">apparatus-in-text app-type-neume apparatus-active</xsl:if>
      </xsl:attribute>
      <span class="flex-wrapper">
        <xsl:attribute name="class">
          <xsl:if test="@type='text'">apparatus-note font-small cbo-border-red</xsl:if>
          <xsl:if test="@type='neume'">apparatus-note font-small cbo-border-blue toggle-neumes</xsl:if>
        </xsl:attribute>
        <xsl:apply-templates select="./rdg" />
        <xsl:apply-templates select="./note" />
      </span>
      <xsl:apply-templates select="./lem" />
    </span>
  </xsl:template>

  <xsl:template match="lem">
    <xsl:apply-templates />
  </xsl:template>

  <xsl:template match="rdg">
    <span class="flex-wrapper rdg" style="margin-left: 6px;">
      <i>
        <xsl:apply-templates />
      </i>
      <i style="margin-left: 6px;"><xsl:value-of select="@wit" /></i>
    <xsl:if test="../note">;</xsl:if>
    </span>
  </xsl:template>

  <xsl:template match="note">
    <i style="margin-left: 6px;">
      <xsl:apply-templates />
    </i>
  </xsl:template>
</xsl:stylesheet>