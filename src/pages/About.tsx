import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, Calendar, Users, GraduationCap } from "lucide-react";

export default function About() {
  const team = [
    {
      name: "김송원",
      role: "학부 인턴 연구원",
      description: "고려대학교 생명과학부 4학년 학생 (2022~)",
      image: "🧑‍🎓",
      details: "2024년 여름부터 CSBL 학부 인턴 프로젝트 참여"
    }
  ];

  const timeline = [
    {
      year: "2024",
      title: "프로젝트 시작",
      description: "고려대학교 계산및합성생물학 연구실(CSBL) 학부 인턴 프로젝트로 진행"
    },
    {
      year: "2025",
      title: "첫 공식 버전 배포",
      description: "2025년 7월 10일에 첫 공식 버전을 배포"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-6">Who We Are?</h1>
        <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          시민과 연구자가 함께 만드는 전국 봄꽃 개화 예측 플랫폼을 구축하는 연구 프로젝트입니다.
          과학적 데이터와 사용자 참여를 통해 더 정확한 개화 예측을 목표로 합니다.
        </p>
      </div>

      {/* Project Overview */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">프로젝트 개요</h2>
        <div className="max-w-4xl mx-auto">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Calendar className="w-5 h-5 mr-2" />
                프로젝트 연혁
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">2024년 여름부터 시작</p>
                  <p className="text-muted-foreground">고려대학교 계산및합성생물학 연구실(CSBL)의 학부 인턴 프로젝트로 진행</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">2025년 7월 10일 첫 공식 버전 배포</p>
                  <p className="text-muted-foreground">시민참여형 개화 예측 플랫폼 "꽃피다" 정식 서비스 시작</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">연구에 참여한 인물</h2>
        <div className="max-w-2xl mx-auto">
          {team.map((member, index) => (
            <Card key={index} className="text-center border-2 border-primary/20">
              <CardHeader>
                <div className="text-6xl mb-4">{member.image}</div>
                <CardTitle className="text-2xl">{member.name}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary" className="text-sm">
                    {member.role}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-lg font-medium">{member.description}</p>
                <p className="text-sm text-muted-foreground">{member.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">프로젝트 타임라인</h2>
        <div className="max-w-3xl mx-auto">
          {timeline.map((item, index) => (
            <div key={index} className="flex items-start mb-8">
              <div className="flex-shrink-0 w-24 text-right mr-6">
                <Badge variant="outline" className="text-sm font-bold">
                  {item.year}
                </Badge>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="mb-16">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center">
              <Users className="w-6 h-6 mr-2" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg mb-6 leading-relaxed">
              기후 변화 시대, 시민 과학자들과 함께 만드는<br />
              <strong>정확하고 신뢰할 수 있는 개화 예측 시스템</strong>을 구축하여<br />
              생태계 모니터링과 과학 연구에 기여합니다.
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="https://github.com/phenofact" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="mailto:rsw147362@gmail.com" 
                className="inline-flex items-center space-x-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <span>Contact</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}